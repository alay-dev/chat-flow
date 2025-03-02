import { Node } from "@xyflow/react";

export type GroupElement = {
  id: string;
  nodeType: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  isInitialized: boolean;
  type: "input" | "bubble";
  placeholder?: string;
  buttonLabel?: string;
  variable?: string;
};

export type Group = Node<{ group: GroupElement[]; name: string }>;

export type Entity = "input" | "bubble";
