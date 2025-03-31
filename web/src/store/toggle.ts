import { create, StoreApi } from "zustand";

interface ChatState {
  isChatsOpen: boolean;
  toggleChats: () => void;
}

type SetState = StoreApi<ChatState>["setState"];

export const useChatStore = create<ChatState>((set: SetState) => ({
  isChatsOpen: false,

  toggleChats: () => {
    set((state) => ({
      isChatsOpen: !state.isChatsOpen,
    }));
  },
}));