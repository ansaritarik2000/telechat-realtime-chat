import { create } from "zustand";

// theme store
export const useThemeStore = create((set) => {
  return {
    theme: localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "light",
    preset: localStorage.getItem("preset"),

    setTheme: (theme) => set((state) => ({ ...state, theme: theme })),
    setPreset: (preset) => {
      localStorage.setItem("preset", preset);
      set({ preset });
    },
  };
});
