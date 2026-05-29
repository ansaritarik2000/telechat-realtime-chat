import { create } from "zustand";

// rcs report bot store
const useReportBotStore = create((set) => {
    return {
        rcsBotReport: [],
        setRcsBotReport: (data) =>
            set((state) => ({ ...state, rcsBotReport: data })),
    };
});

export { useReportBotStore };
