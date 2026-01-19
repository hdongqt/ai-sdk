import { create } from 'zustand';

interface ChatState {
  firstMsg: string | null;
  setFirstMsg: (msg: string | null) => void;
  clearFirstMsg: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  firstMsg: null,
  setFirstMsg: (msg) => set({ firstMsg: msg }),
  clearFirstMsg: () => set({ firstMsg: null }),
}));
