"use client";

import { Background, ReactFlow, useNodesState, useEdgesState, Edge } from "@xyflow/react";
import StartNode from "../_components/start";
import StackNode from "../_components/group";
import { useAppStore } from "@/store/main";
import { Group } from "@/types/common";
import useInitCanvas from "@/hooks/useInitCanvas";

const nodeTypes = {
  GROUP: StackNode,
  START: StartNode,
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };
const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Group>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setActiveElement, isPanDisabled } = useAppStore((state) => state);
  const { onDrop, onConnect, onDragOver, onReconnectEnd, onReconnect, onReconnectStart } = useInitCanvas({ setEdges, setNodes });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onReconnect={onReconnect}
      onReconnectStart={onReconnectStart}
      onReconnectEnd={onReconnectEnd}
      nodeTypes={nodeTypes}
      defaultViewport={defaultViewport}
      panOnDrag={!isPanDisabled}
      fitView
      onDrop={onDrop}
      onDragOver={onDragOver}
      onPaneClick={() => setActiveElement(null)}
    >
      <Background />
    </ReactFlow>
  );
};

export default Canvas;
