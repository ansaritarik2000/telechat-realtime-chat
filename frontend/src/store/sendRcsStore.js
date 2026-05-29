import { create } from "zustand";

// send rcs store
export const useSendRcStore = create((set) => {
    const initialState = {
        selectedBot: {},
        selectedTemplateType: {},
        selectedTemplate: {},
        template: {},
        selectedDate: null,
        interval: [],
        batchSize: 0,
        campaignName: [],
        userId: "", // campaign id
        sendRcsAnimationModelOpen: false,
        csvFileContent: {},
        phoneNumbers: [],
        message: null,
        csvFile: null, // Md Faizan: If typescript then use type <File | null>
        fileProcessingInfo: null, // Md Faizan: This will store CSV file processing like - "allPhoneNumbers" - "invalidPhoneNumbers" - "validPhoneNumbers". If typescript then use type <{valid: number; total: number; invalid: number} | null>

        // Bot selection part
        bots: [],
        templateTypes: [],
        templates: [],

        // schedule & split part
        splitCampaign: false,
        scheduleCampaign: false,

        // contact upload
        contactUploadedFrom: null, // TS: possible values "csv" | "number" | "phonebook" | null

        // Audiance model phone book group
        selectedRadio: "groups",

    // phonebook group selection
    groups: [],

   
  };

    return {
        ...initialState,
        // phonebook group selection
        setGroups: (info) => set((state) => ({ ...state, groups: info })),

        // Audiance model phone book group
        setSelectedRadio: (info) =>
            set((state) => ({ ...state, selectedRadio: info })),

        // contact upload
        setContactUploadedFrom: (info) =>
            set((state) => ({ ...state, contactUploadedFrom: info })),

        // schedule & split part
        setSplitCampaign: (info) =>
            set((state) => ({ ...state, splitCampaign: info })),
        setScheduleCampaign: (info) =>
            set((state) => ({ ...state, scheduleCampaign: info })),

        // Bot selection part
        setBots: (info) => set((state) => ({ ...state, bots: info })),
        setTemplateTypes: (info) =>
            set((state) => ({ ...state, templateTypes: info })),
        setTemplates: (info) => set((state) => ({ ...state, templates: info })),

        // -------
        setSelectedBot: (bot) =>
            set((state) => ({ ...state, selectedBot: bot })),
        setMessage: (info) => set((state) => ({ ...state, message: info })),
        setFileProcessingInfo: (info) =>
            set((state) => ({ ...state, fileProcessingInfo: info })),
        setCsvFile: (file) => set((state) => ({ ...state, csvFile: file })),
        setSelectedTemplateType: (templateType) =>
            set((state) => ({ ...state, selectedTemplateType: templateType })),
        setSelectedTemplate: (templateSelected) =>
            set((state) => ({ ...state, selectedTemplate: templateSelected })),
        setTemplate: (template) =>
            set((state) => ({ ...state, template: template })),
        setSelectedDate: (date) =>
            set((state) => ({ ...state, selectedDate: date })),
        setInterval: (interval) =>
            set((state) => ({ ...state, interval: interval })),
        setBatchSize: (size) => set((state) => ({ ...state, batchSize: size })),
        setCampaignName: (name) =>
            set((state) => ({ ...state, campaignName: name })),
        setUserId: (id) => set((state) => ({ ...state, userId: id })),
        setRcsAnimationModel: (open) =>
            set((state) => ({ ...state, sendRcsAnimationModelOpen: open })),
        setCsvFileContent: (data) =>
            set((state) => ({ ...state, csvFileContent: data })),
        setPhoneNumbers: (data) =>
            set((state) => ({ ...state, phoneNumbers: data })),

        resetSendRcsStore: () => set(() => initialState), //reset all state

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
        resetSelectedDate: () =>
            set(() => ({ selectedDate: initialState.selectedDate })),
        resetInterval: () => set(() => ({ interval: initialState.interval })),
        resetBatchSize: () =>
            set(() => ({ batchSize: initialState.batchSize })),
        resetCampaignName: () =>
            set(() => ({ campaignName: initialState.campaignName })),
        resetUserId: () => set(() => ({ userId: initialState.userId })),
        resetRcsAnimationModel: () =>
            set(() => ({
                sendRcsAnimationModelOpen:
                    initialState.sendRcsAnimationModelOpen,
            })),
        resetCsvFileContent: () =>
            set(() => ({ csvFileContent: initialState.csvFileContent })),
        resetPhoneNumbers: () =>
            set(() => ({ phoneNumbers: initialState.phoneNumbers })),
    };
});
