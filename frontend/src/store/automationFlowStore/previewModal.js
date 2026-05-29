import { create } from "zustand";

// theme store
export const usePreviewTemplateStore = create((set) => {
  return {
    visible: false,
    type: null,
    setVisible: (visible) => set((state) => ({ ...state, visible: visible })),
    setType: (type) => set((state) => ({ ...state, type: type })),
  };
});

