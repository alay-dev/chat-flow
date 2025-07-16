"use client";

import { useGroupStore } from "@/store/group";
import { Group, GroupElement } from "@/types/common";
import { addEdge, Connection, Edge, Position, reconnectEdge, useReactFlow } from "@xyflow/react";
import { nanoid } from "nanoid";
import { Dispatch, DragEvent, SetStateAction, useCallback, useEffect, useRef } from "react";
import "@xyflow/react/dist/style.css";
import { getDefaultValue } from "@/lib/entity";

type Props = {
  setNodes: Dispatch<SetStateAction<Group[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
};

const useInitCanvas = ({ setNodes, setEdges }: Props) => {
  const { screenToFlowPosition, addNodes } = useReactFlow();
  const { dragGroupElement, increaseGroupCount, totalGroup } = useGroupStore((state) => state);
  const edgeReconnectSuccessful = useRef(true);

  useEffect(() => {
    setNodes([{ id: "start", type: "START", data: { group: [], name: "Start" }, position: { x: 0, y: 50 }, sourcePosition: Position.Right }]);
  }, [setEdges, setNodes]);

  const onConnect = useCallback((params: Connection) => setEdges((els) => addEdge(params, els)), [setEdges]);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!dragGroupElement) return;
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

      const element: GroupElement = Object.assign(dragGroupElement, { isInitialized: true, ...getDefaultValue(dragGroupElement.nodeType) });
      const group = { id: nanoid(), type: "GROUP", position, data: { group: [element], name: `Group ${totalGroup + 1}` } };
      addNodes([group]);
      increaseGroupCount();
    },
    [dragGroupElement, increaseGroupCount, screenToFlowPosition, addNodes, totalGroup]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      edgeReconnectSuccessful.current = true;
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onReconnectEnd = useCallback(
    (event: unknown, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return { onDrop, onConnect, onDragOver, onReconnectEnd, onReconnect, onReconnectStart };
};

export default useInitCanvas;
