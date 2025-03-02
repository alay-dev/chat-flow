import ImageElement from "@/components/bubbles/image";
import TextElement from "@/components/bubbles/text";
import { Button } from "@/components/ui/button";
import useGroup from "@/hooks/useGroup";
import { getDefaultValue } from "@/lib/entity";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { Group, GroupElement } from "@/types/common";

import { Edge, Handle, NodeProps, NodeToolbar, Position, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { DragEvent, memo, useCallback, useEffect } from "react";
import { Copy, InfoCircle, PlayCircle, TrashBin2 } from "solar-icon-set";

const StackNode = memo(({ data, isConnectable = true, selected, ...props }: NodeProps<Group>) => {
  const { deleteElements } = useReactFlow<Group, Edge>();
  const { adjustPrevStack, determineClosestPlaceholder, isCurrentStackElement } = useGroup(props.id);
  const { dragGroupElement, setDraggedOverGroup, dereaseGroupCount } = useGroupStore((state) => state);
  const stack = data.group;

  const onDelete = useCallback(() => {
    deleteElements({ nodes: [{ id: props.id }] });
    dereaseGroupCount();
  }, [deleteElements, dereaseGroupCount, props.id]);

  const onDrop = (event: DragEvent<HTMLElement>) => {
    event.stopPropagation();
    if (!dragGroupElement) return;

    if (dragGroupElement.isInitialized) {
      const elementData = JSON.parse(event.dataTransfer.getData("text/plain"));
      if (isCurrentStackElement(elementData.ID)) return;
      adjustPrevStack(elementData.nodeID, elementData.ID);
    }

    const newElement: GroupElement = {
      id: nanoid(),
      type: dragGroupElement.type,
      isInitialized: true,
      nodeType: dragGroupElement.nodeType,
      ...getDefaultValue(dragGroupElement.nodeType),
    };

    const closest = determineClosestPlaceholder(event.clientY);
    const index = stack.findIndex((item) => item.id === closest.id);

    if (closest.delta === "before") {
      stack.splice(index, 0, newElement); // Insert before the closest element
    } else if (closest.delta === "after") {
      stack.splice(index + 1, 0, newElement); // Insert after the closest element
    }

    setDraggedOverGroup(undefined);
  };

  useEffect(() => {
    if (stack.length === 0) {
      onDelete();
    }
  }, [onDelete, stack.length]);

  return (
    <div
      // onDragEnter={() => setDraggedOverGroup(props.id)}
      // onDragExit={() => setDraggedOverGroup(undefined)}
      onDrop={onDrop}
      id={props.id}
      className={cn("bg-white rounded-xl w-[20rem]  border border-blue-100 transition duration-300  overflow-hidden", selected && "border border-blue-700")}
    >
      <NodeToolbar position={Position.Top}>
        <div className="flex items-center border border-blue-300 rounded-lg bg-white overflow-hidden ">
          <Button variant={"ghost"} size={"icon"} className="border-r border-r-blue-300 rounded-none px-5">
            <PlayCircle />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="border-r border-r-blue-300 rounded-none px-5">
            <Copy />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="border-r border-r-blue-300 rounded-none px-5">
            <InfoCircle />
          </Button>
          <Button onClick={onDelete} variant={"ghost"} size={"icon"} className="rounded-none px-5">
            <TrashBin2 />
          </Button>
        </div>
      </NodeToolbar>
      <Handle type="target" position={Position.Left} onConnect={(params) => console.log("handle onConnect", params)} isConnectable={isConnectable} />
      <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} />
      <div className="px-4 py-1 bg-blue-500 text-white">
        <h4 className="font-semibold text-base">{data.name}</h4>
      </div>
      <div className="px-5 pb-5 flex flex-col gap-3 mt-5">
        {stack.map((item, i) => {
          switch (item.nodeType) {
            case "TEXT":
              return <TextElement key={item.id} elementID={item.id} index={i} type={item.type} />;
            case "IMAGE":
              return <ImageElement key={item.id} elementID={item.id} index={i} />;

            case "VIDEO":
            case "AUDIO":
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
});

export default StackNode;

StackNode.displayName = "StackNode";
