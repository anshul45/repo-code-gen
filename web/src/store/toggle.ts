import { create, StoreApi } from "zustand";

interface ChatState {
  isChatsOpen: boolean;
  toggleChats: () => void;
}

type SetState = StoreApi<ChatState>["setState"];
type GetState = StoreApi<ChatState>["getState"];

export const useChatStore = create<ChatState>((set: SetState, get: GetState) => ({
  isChatsOpen: false,

  toggleChats: () => {
    set((state) => ({
      isChatsOpen: !state.isChatsOpen,
    }));
  },
}));