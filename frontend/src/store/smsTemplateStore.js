import { create } from "zustand";

// theme store
// template file store
export const useSmsTemplateStore = create((set) => {
    return {
        file: null,
        setFile: (file) => set((state) => ({ ...state, file: file })),
        resetFile: () => set((state) => ({ ...state, file: null })),
    };
});

// header file store
export const useSmsHeaderStore = create((set) => {
    return {
        file: null,
        setFile: (file) => set((state) => ({ ...state, file: file })),
        resetFile: () => set((state) => ({ ...state, file: null })),
    };
});
