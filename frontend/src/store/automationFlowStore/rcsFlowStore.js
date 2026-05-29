import { create } from "zustand";

// rcs flow store
export const useRcsFlowStore = create((set) => {
    const initialState = {
        selectedBot: {},
        selectedTemplateType: {},
        selectedTemplate: {},
        template: {},
        selectedFile: "",
    };

    return {
        ...initialState,
        setSelectedBot: (bot) =>
            set((state) => ({ ...state, selectedBot: bot })),
        setSelectedTemplateType: (templateType) =>
            set((state) => ({ ...state, selectedTemplateType: templateType })),
        setSelectedTemplate: (templateSelected) =>
            set((state) => ({ ...state, selectedTemplate: templateSelected })),
        setTemplate: (template) =>
            set((state) => ({ ...state, template: template })),
        setSelectedFile: (file) =>
            set((state) => ({ ...state, selectedFile: file })),

        //reset flow store

        resetFlowStore: () => set(() => initialState), //reset all state

        // Individual reset functions
        resetSelectedBot: () =>
            set(() => ({ selectedBot: initialState.selectedBot })),
        resetSelectedTemplateType: () =>
            set(() => ({
                selectedTemplateType: initialState.selectedTemplateType,
            })),
        resetSelectedTemplate: () =>
            set(() => ({ selectedTemplate: initialState.selectedTemplate })),
        resetTemplate: () => set(() => ({ template: initialState.template })),
    };
});
