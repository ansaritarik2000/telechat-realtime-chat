import { create } from "zustand";

const useRcsStore = create((set) => {
  return {
    dashboardDate: new Date(), // Default date is today
    setDashboardDate: (date) =>
      set((state) => ({ ...state, dashboardDate: date })),

    // this are for carousel current index
    currentSlide: 0,
    setCurrentSlide: (bot) => set((state) => ({ ...state, currentSlide: bot })),
  };
});

export { useRcsStore };
