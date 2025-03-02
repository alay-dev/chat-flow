// import { Input } from "../ui/input";
import { ChangeEvent, DragEvent, FocusEvent, Fragment } from "react";
import { Edge, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import { Entity, Group } from "@/types/common";
import { useAppStore } from "@/store/main";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

import { TrashBin2 } from "solar-icon-set";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type Props = {
  elementID: string;
  index: number;
  type: Entity;
};

const Text = (props: Props) => {
  switch (props.type) {
    case "bubble":
      return <TextBubble {...props} />;
    case "input":
      return <TextInput {...props} />;
    default:
      return null;
  }
};

const TextBubble = ({ elementID, index }: Props) => {
  const nodeID = useNodeId()!;
  const nodeData = useNodesData<Group>([nodeID])[0].data;
  const element = nodeData.group?.find((item) => item.id === elementID);
  const { updateNodeData, updateNode } = useReactFlow<Group, Edge>();
  const { activeElement, setDisablePan, setActiveElement } = useAppStore((state) => state);
  const { dragGroupElement, setDragGroupElement, setDraggedOverGroup } = useGroupStore((state) => state);

  // const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (!element) return;
  //   let updatedGroup = nodeData.group;
  //   updatedGroup = updatedGroup.map((item) => {
  //     if (item.id !== element.id) return item;
  //     item.text = e.target.value;
  //     return item;
  //   });

  //   updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  // };

  const onDelete = () => {
    const updatedGroup = nodeData.group.filter((item) => item.id !== elementID);
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  // const onMouseEnter = () => {
  //   updateNode(nodeID, { draggable: false });
  //   setDisablePan(true);
  // };

  // const onMouseLeave = () => {
  //   updateNode(nodeID, { draggable: true });
  //   setDisablePan(false);
  // };

  // const onDrag = (e: DragEvent<HTMLElement>) => {
  //   e.stopPropagation();
  //   e.dataTransfer.setData("text/plain", JSON.stringify({ nodeID, elementID }));
  //   setDragGroupElement(element);
  // };

  // const onDragLeave = () => {
  //   setDraggedOverGroup(undefined);
  // };

  const updateText = (e: FocusEvent<HTMLTextAreaElement, Element>) => {
    const updatedGroup = nodeData.group.map((item) => (item.id === elementID ? { ...item, text: e.target.value } : item));
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  return (
    <Fragment>
      {dragGroupElement ? <div id={elementID + "before"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
      <HoverCard open={activeElement === elementID}>
        <HoverCardTrigger>
          {/* <Input draggable onDrag={onDragStart} onBlur={() => setActiveElement(null)} onFocus={() => setActiveElement(elementID)} value={element?.text} onChange={onChangeText} /> */}
          <div onClick={() => setActiveElement(elementID)} className={cn("w-full  border p-1 px-2 rounded-md")}>
            <MessageComponent template={element?.text || ""} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" sideOffset={28} className="border border-blue-300 rounded-xl w-[25rem]">
          <div className="flex justify-between items-center">
            <p className="text-sm"># Bubble</p>
            <Button onClick={onDelete} variant={"ghost"} size={"icon"} className="text-destructive rounded-full">
              <TrashBin2 />
            </Button>
          </div>

          <div className="flex flex-col gap-1 items-center mt-1">
            <Textarea className="text-sm" defaultValue={element?.text} onBlur={updateText} />
          </div>
        </HoverCardContent>
      </HoverCard>
      {index === nodeData.group.length - 1 && dragGroupElement ? <div id={elementID + "after"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
    </Fragment>
  );
};

const TextInput = ({ elementID, index }: Props) => {
  const nodeID = useNodeId()!;
  const nodeData = useNodesData<Group>([nodeID])[0].data;
  const element = nodeData.group?.find((item) => item.id === elementID);
  const { updateNodeData } = useReactFlow<Group, Edge>();
  const { activeElement, setActiveElement } = useAppStore((state) => state);
  const { dragGroupElement } = useGroupStore((state) => state);

  const onDelete = () => {
    const updatedGroup = nodeData.group.filter((item) => item.id !== elementID);
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  const onUpdatePlaceholder = (e: FocusEvent<HTMLInputElement, Element>) => {
    const updatedGroup = nodeData.group.map((item) => (item.id === elementID ? { ...item, placeholder: e.target.value } : item));
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };
  const onUpdateSendLabel = (e: FocusEvent<HTMLInputElement, Element>) => {
    const updatedGroup = nodeData.group.map((item) => (item.id === elementID ? { ...item, buttonLabel: e.target.value } : item));
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  const onUpdateVariable = (e: FocusEvent<HTMLInputElement, Element>) => {
    const updatedGroup = nodeData.group.map((item) => (item.id === elementID ? { ...item, variable: e.target.value } : item));
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  return (
    <Fragment>
      {dragGroupElement ? <div id={elementID + "before"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
      <HoverCard open={activeElement === elementID}>
        <HoverCardTrigger>
          <div onClick={() => setActiveElement(elementID)} className="border rounded-lg p-2 text-gray-500">
            {element?.placeholder}
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="right" sideOffset={28} className="border border-blue-300 rounded-xl w-[25rem]">
          <div className="flex justify-between items-center">
            <p className="text-sm"># Input</p>
            <Button onClick={onDelete} variant={"ghost"} size={"icon"} className="text-destructive rounded-full">
              <TrashBin2 />
            </Button>
          </div>

          <div className="flex flex-col gap-1  mt-1">
            <Label className="text-sm">Placeholder</Label>
            <Input defaultValue={element?.placeholder} onBlur={onUpdatePlaceholder} />
            <Label className="mt-3 text-sm">Send button label</Label>
            <Input defaultValue={element?.buttonLabel} onBlur={onUpdateSendLabel} />
            <Label className="mt-3 text-sm">Save in variable</Label>
            <Input defaultValue={element?.variable} onBlur={onUpdateVariable} />
          </div>
        </HoverCardContent>
      </HoverCard>
      {index === nodeData.group.length - 1 && dragGroupElement ? <div id={elementID + "after"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
    </Fragment>
  );
};

const MessageComponent = ({ template }: { template: string }) => {
  const regex = /\{\{(.*?)\}\}/g; // Matches {{key}}

  const parts = template.split(regex); // Splits the string at placeholders

  return (
    <p>
      {parts.map((part, index) =>
        template.includes(`{{${part}}}`) ? (
          <span key={index} className="bg-blue-500 text-white w-56 px-2 rounded-md pb-px ">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </p>
  );
};

export default Text;
