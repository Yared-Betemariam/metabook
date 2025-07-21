import { ChatMessage } from "@/types";
import { create } from "zustand";

type MessageStore = {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;
  addMessages: (messages: ChatMessage) => void;
  removeLastMessage: () => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessages: (message) => set({ messages: get().messages.concat(message) }),
  clearMessages: () => set({ messages: [] }),
  removeLastMessage: () => {
    const messages = get().messages;
    if (messages.length > 0) {
      set({ messages: messages.slice(0, -1) });
    }
  },
}));
