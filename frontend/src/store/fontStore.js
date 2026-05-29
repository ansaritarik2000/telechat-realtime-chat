import { create } from "zustand";

export const useFontStore = create((set) => ({
  selectedFont: "Inter",
  setFont: (font) => set({ selectedFont: font }),
}));
