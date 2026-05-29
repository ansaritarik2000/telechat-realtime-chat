import { create } from "zustand";

// rcs report template store
const useReportTemplateRcsStore = create((set) => {
    return {
        rcsTemplateReport: [],
        setRcsTemplateReport: (data) =>
            set((state) => ({ ...state, rcsTemplateReport: data })),
    };
});

export { useReportTemplateRcsStore };
