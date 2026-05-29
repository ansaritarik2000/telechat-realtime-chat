import { create } from "zustand";

// send whatsapp store
export const useSendWhatsappStore = create((set) => {
    // inital campaign state
    const initialCampaignState = {
        selectedTemplate: [],
        campaignName: "",
        selectedTemplateName:"",
        csvFileContent: {},
        selectedTemplateTypeSend:'',
        phoneNumbers: [],
        testPhoneNumbers:[],
        wabaID:null,
        templateContentData: {},
        sendWhatsappAnimationModelOpen: false,
        selectedDate: null,
        selectedExpirationDate: null,
        interval: [],
        batchSize: 0,
        singleTemplateData:[],
        mediaUrl:[],
        MediaId:[],
        mediaFileName:[],
        campaignId: "",
        isDrawerOpen:false,
        contactUploadedFrom: null, // TS: possible values "csv" | "number" | "phonebook" | null
        currentSlide:null,
        // Audiance model phone book group
        selectedRadio: "groups",
        contactUploadedFrom: null,
        // phonebook group selection
        groups: [],
        csvFile: null, 
        fileProcessingInfo: null,
        variableMappings: {},
        userId: localStorage.getItem("user_id"),
        numDisable:false,


        // Whats app Dashboard Date 
        dashboardDate: new Date(), // Default date is today
        carouselUrls:''
    
    };

    // initial chat state
    const initialChatState = {
        timeLeft: 24 * 60 * 60, // 24 hours in seconds
        isPinned: false,
        whatsAppChats: [],
        selectedSendTemplate: {},
    };

    //
    return {
        ...initialCampaignState,
        ...initialChatState,

// Set whatsappp dashboard date 
setDashboardDate: (date) =>
    // set the dashboard date
    set((state) => ({ ...state, dashboardDate: date })),
    // temporary carousel url trap
      setCarouselUrls:(value) => set((state) => ({ ...state, carouselUrls: value })),
        setNumdisable: (value) => set((state) => ({ ...state, numDisable: value })),
        // for the dyanmically update selected varibale
        setVariableMappings: (mappings) => set({ variableMappings: mappings }),
        //set campaign state
        setGroups: (info) => set((state) => ({ ...state, groups: info })),
        
        // Audiance model phone book group
        setSelectedRadio: (info) =>
          set((state) => ({ ...state, selectedRadio: info })),
        // Set the slide in corousel case
        setCurrentSlide: (slide) =>
            set((state) => ({ ...state, currentSlide: slide })),
        setCsvFile: (file) => set((state) => ({ ...state, csvFile: file })),
        setFileProcessingInfo: (info) =>
            set((state) => ({ ...state, fileProcessingInfo: info })),
         // contact upload
    setContactUploadedFrom: (info) =>
        set((state) => ({ ...state, contactUploadedFrom: info })),
        // contact upload
        setContactUploadedFrom: (info) =>
          set((state) => ({ ...state, contactUploadedFrom: info })),
        setCampaignId: (id) => set((state) => ({ ...state, campaignId: id })),
        setCampaignName: (name) =>
            set((state) => ({ ...state, campaignName: name })),
        setSelectedTemplateName: (name) =>
            set((state) => ({ ...state, selectedTemplateName: name })),
        setSingleTemplateData:(content) =>
            set((state) => ({ ...state, singleTemplateData: content })),
        setCsvFileContent: (data) =>
            set((state) => ({ ...state, csvFileContent: data })),
        setPhoneNumbers: (data) =>
            set((state) => ({ ...state, phoneNumbers: data })),
        setTestPhoneNumbers: (data) =>
            set((state) => ({ ...state, testPhoneNumbers: data })),
        setSelectedTemplateTypeSend: (data) =>
            set((state) => ({ ...state, selectedTemplateTypeSend: data })),
        setSelectedDate: (date) =>
            set((state) => ({ ...state, selectedDate: date })),
        setSelectedExpirationDate: (date) =>
            set((state) => ({ ...state, selectedExpirationDate: date })),
        setInterval: (interval) =>
            set((state) => ({ ...state, interval: interval })),
        setBatchSize: (size) => set((state) => ({ ...state, batchSize: size })),
        setSelectedTemplate: (data) =>
            set((state) => ({ ...state, selectedTemplate: data })),
        setWabaID: (data) => set((state) => ({ ...state, wabaID: data })),
        setTemplateContentData: (data) =>
            set((state) => ({ ...state, templateContentData: data })),
        setWhatsappAnimationModel: (open) =>
            set((state) => ({
                ...state,
                sendWhatsappAnimationModelOpen: open,
            })),
        // set chat state
        setTimeLeft: (timeLeft) =>
            set((state) => ({ ...state, timeLeft: timeLeft })),
        setIsPinned: (isPinned) =>
            set((state) => ({ ...state, isPinned: isPinned })),
        setWhatsaAppChats: (whatsAppChats) =>
            set((state) => ({ ...state, whatsAppChats: whatsAppChats })),
        setSelectedSendTemplate: (selectedTemplate) =>
            set((state) => ({
                ...state,
                selectedSendTemplate: selectedTemplate,
            })),
            setMediaUrl: (url) => {
                set((state) => {
                  if (state.selectedTemplateTypeSend === 'carousel') {
                    return {...state, mediaUrl: Array.isArray(url) ? url : [...(state.mediaUrl || []), url]};
                  }
                  return {...state, mediaUrl: url};
                });
              },
              setMediaId: (id) => {
                set((state) => {
                  if (state.selectedTemplateTypeSend === 'carousel') {
                    return {...state, MediaId: Array.isArray(id) ? id : [...(state.MediaId || []), id]};
                  }
                  return {...state, MediaId: id};
                });
              },
              setMediaFileName: (fileName) => {
                set((state) => {
                  if (state.selectedTemplateTypeSend === 'carousel') {
                    return {...state, mediaFileName: Array.isArray(fileName) ? fileName : [...(state.mediaFileName || []), fileName]};
                  }
                  return {...state, mediaFileName: fileName};
                });
              },
        // Individual reset functions
        resetCsvFileContent: () =>
            set(() => ({
                csvFileContent: initialCampaignState.csvFileContent,
            })),
        resetCampaignId: () =>
            set(() => ({ campaignId: initialCampaignState.campaignId })),
        resetCampaignName: () =>
            set(() => ({ campaignName: initialCampaignState.campaignName })),
        resetPhoneNumbers: () =>
            set(() => ({ phoneNumbers: initialCampaignState.phoneNumbers })),
        resetWhatsappAnimationModel: () =>
            set(() => ({
                sendWhatsappAnimationModelOpen:
                    initialCampaignState.sendWhatsappAnimationModelOpen,
            })),
            setDrawerOpen: (drawer) =>
                set((state) => ({ ...state, isDrawerOpen: drawer})),
             // reset all state campaings
        resetSendWhatsappStore: () => set(() => initialCampaignState), //reset all state

        // reset all state chats
        resetChatState: () => set(() => initialChatState), //reset all state
    };
});
