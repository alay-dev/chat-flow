import { Bubble } from "@/types/bubbles";
import { Entity } from "@/types/common";
import { ChatLine, Gallery, MusicNote, VideoFrame } from "solar-icon-set";

export const BUBBLES: { icon: any; label: string; nodeType: Bubble; type: Entity }[] = [
  { label: "Text", icon: ChatLine, nodeType: "TEXT", type: "bubble" },
  { label: "Image", icon: Gallery, nodeType: "IMAGE", type: "bubble" },
  { label: "Video", icon: VideoFrame, nodeType: "VIDEO", type: "bubble" },
  { label: "Audio", icon: MusicNote, nodeType: "AUDIO", type: "bubble" },
];

export const defaultTextMessage = "Ask a question or convey some message";
export const defaultPlaceholderMessage = "Type your answer...";
export const defaultSendLabel = "Send";
