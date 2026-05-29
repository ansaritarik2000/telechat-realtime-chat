import { create } from "zustand";

// send sms store
export const useSendSmsStore = create((set) => {
    const initialState = {
        selectedHeader: {},
        selectedTemplateType: {},
        selectedTemplate: {},
        selectedDate: null,
        interval: [],
        batchSize: 0,
        campaignName: [],
        userId: "",
        sendSmsAnimationModelOpen: false,
        templateTypes: [],
        templates: [],
        headers: [],
        shortUrlMainDomain: "https://1tp.in",
        triggerUrl: "",
        shortUrl: "",
        csvFileContent: {},
        phoneNumbers: [],
        sendAsFlashSMS: false,
        smsCharacterCount: 0,

        csvFile: null, // If typescript then use type <File | null>
        fileProcessingInfo: null, // This will store CSV file processing like - "allPhoneNumbers" - "invalidPhoneNumbers" - "validPhoneNumbers". If typescript then use type <{valid: number; total: number; invalid: number} | null>

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
        setSelectedHeader: (bot) =>
            set((state) => ({ ...state, selectedHeader: bot })),
        setSelectedTemplateType: (templateType) =>
            set((state) => ({ ...state, selectedTemplateType: templateType })),
        setSelectedTemplate: (templateSelected) =>
            set((state) => ({ ...state, selectedTemplate: templateSelected })),
        setTemplateTypes: (templateTypes) =>
            set((state) => ({ ...state, templateTypes: templateTypes })),
        setTemplates: (templates) =>
            set((state) => ({ ...state, templates: templates })),
        setHeaders: (headers) =>
            set((state) => ({ ...state, headers: headers })),
        setSelectedDate: (date) =>
            set((state) => ({ ...state, selectedDate: date })),
        setInterval: (interval) =>
            set((state) => ({ ...state, interval: interval })),
        setBatchSize: (size) => set((state) => ({ ...state, batchSize: size })),
        setCampaignName: (name) =>
            set((state) => ({ ...state, campaignName: name })),
        setUserId: (id) => set((state) => ({ ...state, userId: id })),
        setSmsAnimationModel: (open) =>
            set((state) => ({ ...state, sendSmsAnimationModelOpen: open })),
        setCsvFileContent: (data) =>
            set((state) => ({ ...state, csvFileContent: data })),
        setPhoneNumbers: (data) =>
            set((state) => ({ ...state, phoneNumbers: data })),
        setSendAsFlashSMS: (data) =>
            set((state) => ({ ...state, sendAsFlashSMS: data })),

        setCsvFile: (file) => set((state) => ({ ...state, csvFile: file })),
        setFileProcessingInfo: (info) =>
            set((state) => ({ ...state, fileProcessingInfo: info })),
        setContactUploadedFrom: (info) =>
            set((state) => ({ ...state, contactUploadedFrom: info })),

        // schedule & split part
        setSplitCampaign: (info) =>
            set((state) => ({ ...state, splitCampaign: info })),
        setScheduleCampaign: (info) =>
            set((state) => ({ ...state, scheduleCampaign: info })),

        // Audiance model phone book group
        setSelectedRadio: (info) =>
            set((state) => ({ ...state, selectedRadio: info })),

        // phonebook group selection
        setGroups: (info) => set((state) => ({ ...state, groups: info })),

        setShortUrlMainDomain: (info) =>
            set((state) => ({ ...state, shortUrlMainDomain: info })),
        setTriggerUrl: (info) =>
            set((state) => ({ ...state, triggerUrl: info })),
        setShortUrl: (info) => set((state) => ({ ...state, shortUrl: info })),

        setSmsCharacterCount: (info) =>
            set((state) => ({ ...state, smsCharacterCount: info })),

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
        resetSelectedDate: () =>
            set(() => ({ selectedDate: initialState.selectedDate })),
        resetInterval: () => set(() => ({ interval: initialState.interval })),
        resetBatchSize: () =>
            set(() => ({ batchSize: initialState.batchSize })),
        resetCampaignName: () =>
            set(() => ({ campaignName: initialState.campaignName })),
        resetUserId: () => set(() => ({ userId: initialState.userId })),
        resetSmsAnimationModel: () =>
            set(() => ({
                sendSmsAnimationModelOpen:
                    initialState.sendSmsAnimationModelOpen,
            })),
        resetCsvFileContent: () =>
            set(() => ({ csvFileContent: initialState.csvFileContent })),
        resetPhoneNumbers: () =>
            set(() => ({ phoneNumbers: initialState.phoneNumbers })),
        resetSendAsFlashSMS: () =>
            set((state) => ({
                ...state,
                sendAsFlashSMS: initialState.sendAsFlashSMS,
            })),
    };
});
