import { useAppStore } from "@/store/main";
import { Group } from "@/types/common";
import { Edge, useNodeId, useNodesData, useReactFlow } from "@xyflow/react";
import { ChangeEvent, Fragment } from "react";
import { GalleryAdd, TrashBin2 } from "solar-icon-set";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { Button } from "../ui/button";
import { useGroupStore } from "@/store/group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type Props = {
  elementID: string;
  index: number;
};

const ImageElement = ({ elementID, index }: Props) => {
  const nodeID = useNodeId()!;
  const nodeData = useNodesData<Group>([nodeID])[0].data;
  const element = nodeData.group?.find((item) => item.id === elementID);
  const { updateNodeData } = useReactFlow<Group, Edge>();
  const activeElement = useAppStore((state) => state.activeElement);
  const setActiveElement = useAppStore((state) => state.setActiveElement);
  const { dragGroupElement } = useGroupStore((state) => state);

  const onUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !element) return;
    const files = Array.from(e.target.files);
    const file = files[0];
    if (!file) return;

    const imgURL = URL.createObjectURL(file);

    let updatedGroup = nodeData.group;
    updatedGroup = updatedGroup.map((item) => {
      if (item.id !== element.id) return item;
      item.image = imgURL;
      return item;
    });

    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  const onDelete = () => {
    const updatedGroup = nodeData.group.filter((item) => item.id !== elementID);
    updateNodeData(nodeID, { ...nodeData, group: updatedGroup });
  };

  return (
    <Fragment>
      {dragGroupElement ? <div id={elementID + "before"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
      <div>
        <HoverCard open={activeElement === elementID}>
          <HoverCardTrigger>
            {element?.image ? (
              <div onClick={() => setActiveElement(elementID)} className="z-20">
                <img src={element?.image} alt="image" className="max-h-60 w-full object-cover rounded-lg" />
              </div>
            ) : (
              <div onClick={() => setActiveElement(elementID)} className="border border-dashed border-blue-400 rounded-xl p-4 flex flex-col gap-2 items-center justify-between bg-blue-50">
                <GalleryAdd size={20} />
                <h4 className="font-semibold text-blue-700">Add a image</h4>
              </div>
            )}
          </HoverCardTrigger>
          <HoverCardContent side="right" sideOffset={28} className="border border-blue-300 rounded-xl w-[25rem]">
            <div className="flex justify-between items-center">
              <p className="text-sm"># Bubble</p>
              <Button onClick={onDelete} variant={"ghost"} size={"icon"} className="text-destructive rounded-full">
                <TrashBin2 />
              </Button>
            </div>

            <div className="flex flex-col gap-1 items-center mt-1">
              <Tabs defaultValue="local" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="local" className="flex-1">
                    Local
                  </TabsTrigger>
                  <TabsTrigger value="remote" className="flex-1">
                    Remote
                  </TabsTrigger>
                  <TabsTrigger value="unsplash" className="flex-1">
                    Unsplash
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="local">
                  <label htmlFor="upload-image" onClick={() => setActiveElement(elementID)} className="border border-dashed border-blue-400 rounded-xl p-4 flex flex-col gap-2 items-center justify-between bg-blue-50">
                    <GalleryAdd size={20} />
                    <h4 className="font-semibold text-blue-700">Upload image</h4>
                  </label>
                  <input id="upload-image" type="file" className="hidden" onChange={onUploadImage} />
                </TabsContent>
              </Tabs>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      {index === nodeData.group.length - 1 && dragGroupElement ? <div id={elementID + "after"} className="bg-gray-100 h-2 w-full rounded-md"></div> : null}
    </Fragment>
  );
};

export default ImageElement;
