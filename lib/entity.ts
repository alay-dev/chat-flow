import { defaultPlaceholderMessage, defaultSendLabel, defaultTextMessage } from "@/constants/bubbles";
import { GroupElement } from "@/types/common";

export const getDefaultValue = (elementType: string): Partial<GroupElement> => {
  return {
    text: elementType === "TEXT" ? defaultTextMessage : undefined,
    placeholder: elementType === "TEXT" ? defaultPlaceholderMessage : undefined,
    buttonLabel: defaultSendLabel,
  };
};
