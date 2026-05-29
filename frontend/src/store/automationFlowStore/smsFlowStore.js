import { create } from "zustand";

// sms flow store
export const useSmsFlowStore = create((set) => {
    const initialState = {
        selectedHeader: {},
        selectedTemplateType: {},
        selectedTemplate: {},
        sendAsFlashSMS: false,
    };

    return {
        ...initialState,
        setSelectedHeader: (bot) =>
            set((state) => ({ ...state, selectedHeader: bot })),
        setSelectedTemplateType: (templateType) =>
            set((state) => ({ ...state, selectedTemplateType: templateType })),
        setSelectedTemplate: (templateSelected) =>
            set((state) => ({ ...state, selectedTemplate: templateSelected })),

        setSendAsFlashSMS: (data) =>
            set((state) => ({ ...state, sendAsFlashSMS: data })),

        resetSendSmsStore: () => set(() => initialState), //reset all state

        // Individual reset functions
        resetHeaderBot: () =>
            set(() => ({ selectedHeader: initialState.selectedHeader })),
        resetSelectedTemplateType: () =>
            set(() => ({
                selectedTemplateType: initialState.selectedTemplateType,
            })),
        resetSelectedTemplate: () =>
            set(() => ({ selectedTemplate: initialState.selectedTemplate })),
        resetSendAsFlashSMS: () =>
            set((state) => ({
                ...state,
                sendAsFlashSMS: initialState.sendAsFlashSMS,
            })),
    };
});
