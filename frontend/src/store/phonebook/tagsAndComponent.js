import { create } from "zustand";

// tags and components store
export const useTagsAndComponentsStore = create((set) => {
    const initialState = {
        // company details and user details
        tagsName: "",
        tagsColor: "text-gray-600",
        tagsBgColor: "bg-gray-100",
    };

    return {
        ...initialState,

        // Setters for company details and user details
        setTagsName: (name) => set((state) => ({ ...state, tagsName: name })),
        setTagsColor: (color) =>
            set((state) => ({ ...state, tagsColor: color })),
        setTagsBgColor: (bgColor) =>
            set((state) => ({ ...state, tagsBgColor: bgColor })),

        // Reset function for all state
        resetTagsAndComponents: () => set(() => initialState),
    };
});
