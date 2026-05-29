// Store for route change modal
import { create } from "zustand";

export const useRouteChangeModal = create((set) => {
  return {
    routeChangeModalOpen: false,
    setRouteChangeModalOpen: (value) => set({ routeChangeModalOpen: value }),
  };
});
