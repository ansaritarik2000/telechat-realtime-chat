import { create } from "zustand";

export const useSidebarStore = create((set) => {
  return {
    sidebarActive: false,
    setSidebarActive: (active) =>
      set((state) => ({ ...state, sidebarActive: active })),
  };
});
