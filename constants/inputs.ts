import { Entity } from "@/types/common";
import { Hashtag, Link, MentionCircle, Text } from "solar-icon-set";

export const INPUTS: { icon: any; label: string; nodeType: string; type: Entity }[] = [
  { icon: Text, label: "Text", nodeType: "TEXT", type: "input" },
  { icon: Hashtag, label: "Number", nodeType: "NUMBER", type: "input" },
  { icon: MentionCircle, label: "Email", nodeType: "EMAIL", type: "input" },
  { icon: Link, label: "Link", nodeType: "LINK", type: "input" },
];
