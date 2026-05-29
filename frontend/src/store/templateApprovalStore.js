import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // For immutability

// template store
export const useTemplateStore = create((set) => {
    const initialState = {
        selectedTemplate: "whatsapp",
        selectedTemplateType: "text_message",
        templateName: "",
        fallbackText: "",
        fallbackTextVariables: [],
        smsselectedTemplateType: "promotional",
        smsHeader: "",
        selectedBot: {},
        textMessageContent: {
            textMessage: "",
            variables: [],
            buttons: [
                {
                    id: 1,
                    suggestionType: "Reply",
                    displayText: "Stop",
                    postback: "Stop",
                },
            ],
        },

        singleImageContent: {
            title: "",
            titleVariables: [],
            descriptionVariables: [],
            description: "",
            imageUrl: "",
            buttons: [
                {
                    id: 1,
                    suggestionType: "Reply",
                    displayText: "Stop",
                    postback: "Stop",
                },
            ],
        },
        carouselItems: [
            {
                id: 0,
                title: "",
                description: "",
                titleVariables: [],
                descriptionVariables: [],
                imageUrl: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "Reply",
                        displayText: "Stop",
                        postback: "Stop",
                    },
                ],
            },
        ],

        videoContent: {
            title: "",
            description: "",
            titleVariables: [],
            descriptionVariables: [],
            videoFile: "",
            thumbnailUrl: "",
            buttons: [
                {
                    id: 1,
                    suggestionType: "Reply",
                    displayText: "Stop",
                    postback: "Stop",
                },
            ],
        },
    };

    return {
        ...initialState,
        setSelectedTemplate: (template) =>
            set((state) => ({ ...state, selectedTemplate: template })),
        setSelectedTemplateType: (templateType) =>
            set((state) => ({ ...state, selectedTemplateType: templateType })),
        setTemplateName: (templateName) =>
            set((state) => ({ ...state, templateName })),
        setSmsSelectedTemplateType: (templateType) =>
            set((state) => ({
                ...state,
                smsselectedTemplateType: templateType,
            })),
        setSMSHeader: (header) =>
            set((state) => ({ ...state, smsHeader: header })),
        setSelectedBot: (bot) =>
            set((state) => ({ ...state, selectedBot: bot })),
        setFallbackText: (text) =>
            set((state) => ({ ...state, fallbackText: text })),
        setFallbackTextVariables: (variables) =>
            set((state) => ({
                ...state,
                fallbackTextVariables: variables,
            })),
        setTextMessageContent: (bot) =>
            set((state) => ({ ...state, textMessageContent: bot })),
        setSingleImageContent: (bot) =>
            set((state) => ({ ...state, singleImageContent: bot })),
        setVideoContent: (bot) =>
            set((state) => ({ ...state, videoContent: bot })),
        setCarouselItems: (bot) =>
            set((state) => ({ ...state, carouselItems: bot })),
        // Reset function
        resetStore: () => set(() => initialState),
    };
});

// rcs bot store
export const useRcsBotStore = create((set) => {
    const initialState = {
        // banner and logo
        rcsBrandIcon: {
            file: "",
            preview: "",
        },
        rcsBrandBanner: {
            file: "",
            preview: "",
        },

        //bot name
        rcsBotName: "",

        // brand and short description
        rcsBrandName: "",
        rcsShortDescription: "",

        // contact
        rcsPhoneInfo: {
            label: "",
            value: "",
        },

        rcsCountryCodeInfo: "+91",

        rcsWebsiteInfo: {
            label: "",
            value: "",
        },
        rcsEmailInfo: {
            label: "",
            value: "",
        },

        // brand website info
        rcsTermsUrl: "",
        rcsPrivacyUrl: "",
        rcsWebhookUrl: "",
        rcsChatBotLanguage: "",

        // brand color
        rcsBrandColor: "#6B7280",
    };
    return {
        ...initialState,
        setRcsBrandIcon: (bot) =>
            set((state) => ({ ...state, rcsBrandIcon: bot })),
        setRcsBrandBanner: (bot) =>
            set((state) => ({ ...state, rcsBrandBanner: bot })),
        setRcsBrandColor: (bot) =>
            set((state) => ({ ...state, rcsBrandColor: bot })),
        setRcsBotName: (bot) => set((state) => ({ ...state, rcsBotName: bot })),
        setRcsBrandName: (bot) =>
            set((state) => ({ ...state, rcsBrandName: bot })),
        setRcsShortDescription: (bot) =>
            set((state) => ({ ...state, rcsShortDescription: bot })),
        setRcsPhoneInfo: (bot) =>
            set((state) => ({ ...state, rcsPhoneInfo: bot })),
        setRcsCountryCodeInfo: (bot) =>
            set((state) => ({ ...state, rcsCountryCodeInfo: bot })),
        setRcsWebsiteInfo: (bot) =>
            set((state) => ({ ...state, rcsWebsiteInfo: bot })),
        setRcsEmailInfo: (bot) =>
            set((state) => ({ ...state, rcsEmailInfo: bot })),
        setRcsBrandColor: (bot) =>
            set((state) => ({ ...state, rcsBrandColor: bot })),
        setRcsTermsUrl: (bot) =>
            set((state) => ({ ...state, rcsTermsUrl: bot })),
        setRcsPrivacyUrl: (bot) =>
            set((state) => ({ ...state, rcsPrivacyUrl: bot })),
        setRcsWebhookUrl: (bot) =>
            set((state) => ({ ...state, rcsWebhookUrl: bot })),
        setRcsChatBotLanguage: (bot) =>
            set((state) => ({ ...state, rcsChatBotLanguage: bot })),
    };
});

export const useImageUploadStore = create((set) => {
    return {
        imageUploadconditons: [
            {
                text: "Horizontal orientation: 3:4 and 768x1024",
                condition: true,
                type: "horizontal_normal",
            },

            {
                text: "Image format: JPEG, PNG",
                condition: true,
                type: "format",
            },
            { text: "Maximum file size: 2MB", condition: true, type: "size" },
        ],
        setImageUploadConditions: (conditions) =>
            set((state) => ({ ...state, imageUploadconditons: conditions })),
    };
});

// Define the store structure
export const useWhatsappTemplateStore = create(
    immer((set) => {
        const initialState = {
            selectedTemplate: "whatsapp",
            selectedWabaid: "",
            selectedCategory: "",
            selectedSubOption: "",
            selectedSubTimeOption: "",
            selectedTemplateformate: "",
            selectedSubTextOffer: "",
            expirationTime: "",
            selectedCountry: "",
            selectedCountryLable: "",
            templateName: "",
            headerContent: {
                textMessage: "",
                variables: [],
            },
            selectedTemplateType: "",
            currentSlide: 0,
            textMessageContent: {
                textMessage: "",
                FooterText: "",
                variables: [],
                buttons: [
                    {
                        id: 1,
                        suggestionType: "quick_reply", // Type of action
                        displayText: "Reply", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },
            singleImageContent: {
                textMessage: "",
                FooterText: "",
                variables: [],
                imageUrl: "",
                name: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "quick_reply", // Type of action
                        displayText: "Reply", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },
            documentContent: {
                textMessage: "",
                FooterText: "",
                variables: [],
                imageUrl: "",
                name: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "quick_reply", // Type of action
                        displayText: "Reply", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },
            location: {
                textMessage: "",
                FooterText: "",
                variables: [],
                imageUrl: "",
                name: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "quick_reply", // Type of action
                        displayText: "Reply", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },
            carouselItems: [
                {
                    id: 0,
                    textMessage: "",
                    FooterText: "",
                    variables: [],
                    imageUrl: "",
                    name: "",
                    buttons: [
                        {
                            id: 1,
                            suggestionType: "quick_reply",
                            displayText: "",
                            displayTextValue: "",
                        },
                        {
                            id: 2,
                            suggestionType: "url",
                            displayText: "",
                            displayTextValue: "",
                        },
                    ],
                },
            ],

            carouselBodyContent: {
                textMessage: "",
                variables: [],
            },
            carouelType: "image",
            videoContent: {
                textMessage: "",
                FooterText: "",
                variables: [],
                videoFile: "",
                thumbnailUrl: "",
                name: "",
                buttons: [
                    {
                        id: 1,
                        suggestionType: "quick_reply", // Type of action
                        displayText: "Reply", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },

            actionCounts: {
                url: 0,
                quick_reply: 0,
                phone_number: 0,
                copy_code: 0,
            },
            // Lto start here
            LtoContent: {
                textMessage: "",
                timeOffertext: "",
                variables: [],
                buttons: [
                    {
                        id: 1,
                        suggestionType: "copy_code", // Type of action
                        displayText: "Copy Offer Code", // Button Text
                        displayTextValue: "", // value
                    },
                    {
                        id: 2,
                        suggestionType: "url", // Type of action
                        displayText: "Visit us", // Button Text
                        displayTextValue: "", // value
                    },
                    {
                        id: 2,
                        suggestionType: "url", // Type of action
                        displayText: "", // Button Text
                        displayTextValue: "", // value
                    },
                ],
            },
            mediaType: null,
        };

        return {
            // State
            ...initialState,
            // Disable the action button according to selection
            incrementActionCount: (actionKey) =>
                set((state) => ({
                    actionCounts: {
                        ...state.actionCounts,
                        [actionKey]: state.actionCounts[actionKey] + 1,
                    },
                })),
            decrementActionCount: (actionKey) =>
                set((state) => ({
                    actionCounts: {
                        ...state.actionCounts,
                        [actionKey]: Math.max(
                            0,
                            state.actionCounts[actionKey] - 1
                        ),
                    },
                })),
            resetActionCounts: () =>
                set((state) => ({
                    actionCounts: {
                        url: 0,
                        quick_reply: 0,
                        phone_number: 0,
                        copy_code: 0,
                    },
                })),
            // Generic updater for any field
            updateField: (field, value) => {
                set((state) => {
                    state[field] = value;
                });
            },

            // Template-specific setters

            addVariable: (templateType, cardId = null) =>
                set((state) => {
                    if (templateType === "carouselItems") {
                        // Find the correct carousel item
                        const index = state.carouselItems.findIndex(
                            (item) => item.id === cardId
                        );
                        if (index !== -1) {
                            const carouselItem = state.carouselItems[index];

                            //  Ensure `variables` exists
                            if (!carouselItem.variables) {
                                carouselItem.variables = [];
                            }

                            const nextVariableNumber =
                                carouselItem.variables.length + 1;
                            const newVariable = `{{${nextVariableNumber}}}`;

                            carouselItem.textMessage += ` ${newVariable}`;
                            carouselItem.variables.push(newVariable);
                        }
                    } else {
                        const currentContent = state[templateType];
                        const nextVariableNumber =
                            currentContent.variables.length + 1;
                        const newVariable = `{{${nextVariableNumber}}}`;
                        currentContent.textMessage += ` ${newVariable}`;
                        console.log("newVariable", newVariable);
                        currentContent.variables.push(newVariable);
                    }
                }),
            // Add buttons
            addButton: (contentType, button, cardId) =>
                set((state) => {
                    if (cardId === null) {
                        // Normal content type (not carousel)
                        const content = state[contentType];

                        if (!content) return; // Prevent errors

                        // Initialize buttons array if missing
                        if (!content.buttons) {
                            content.buttons = [];
                        }

                        button.id = content.buttons.length + 1; // Assign unique ID
                        content.buttons.push(button);
                    } else {
                        // Carousel Case: Find the correct carousel item
                        const index = state.carouselItems.findIndex(
                            (item) => item.id === cardId
                        );
                        if (index !== -1) {
                            // Ensure buttons exist
                            if (!state.carouselItems[index].buttons) {
                                state.carouselItems[index].buttons = [];
                            }

                            button.id =
                                state.carouselItems[index].buttons.length + 1;
                            state.carouselItems[index].buttons.push(button);
                        }
                    }
                }),

            // remove buttons
            removeButton: (contentType, buttonId, cardId = null) =>
                set((state) => {
                    if (cardId === null) {
                        // Normal Content Type (Not Carousel)
                        const content = state[contentType];
                        if (content?.buttons) {
                            content.buttons = content.buttons.filter(
                                (btn) => btn.id !== buttonId
                            );
                        }
                    } else {
                        // Carousel Case: Remove from specific carousel item
                        const index = state.carouselItems.findIndex(
                            (item) => item.id === cardId
                        );
                        if (index !== -1) {
                            state.carouselItems[index].buttons =
                                state.carouselItems[index].buttons.filter(
                                    (btn) => btn.id !== buttonId
                                );
                        }
                    }
                }),

            updateButtonField: (
                contentType,
                cardId = null,
                buttonId,
                field,
                value
            ) =>
                set((state) => {
                    if (cardId === null) {
                        // Normal Content Type
                        const content = state[contentType];
                        if (content?.buttons) {
                            const button = content.buttons.find(
                                (btn) => btn.id === buttonId
                            );
                            if (button) {
                                button[field] = value;
                            }
                        }
                    } else {
                        // Carousel Case
                        const index = state.carouselItems.findIndex(
                            (item) => item.id === cardId
                        );
                        if (index !== -1) {
                            const button = state.carouselItems[
                                index
                            ].buttons.find((btn) => btn.id === buttonId);
                            if (button) {
                                button[field] = value;
                            }
                        }
                    }
                }),
            // set slide for carousel
            setCurrentSlide: (content) =>
                set((state) => {
                    state.currentSlide = content;
                }),
            // set header of text
            setHeaderText: (content) =>
                set((state) => ({
                    headerContent: {
                        ...state.headerContent,
                        textMessage: content.textMessage,
                        variables: content.variables,
                    },
                })),
            // add header variable
            addHeaderVariables: () =>
                set((state) => {
                    const nextVariableNumber =
                        state.headerContent.variables.length + 1;
                    const newVariable = `{{${nextVariableNumber}}}`;
                    return {
                        headerContent: {
                            textMessage: `${state.headerContent.textMessage} ${newVariable}`,
                            variables: [
                                ...state.headerContent.variables,
                                newVariable,
                            ],
                        },
                    };
                }),

            setTextMessageContent: (content) =>
                set((state) => {
                    state.textMessageContent = {
                        ...state.textMessage,
                        ...state.FooterText, // Preserve existing structure
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ??
                            state.textMessageContent.buttons ??
                            [], // Ensure buttons array always exists
                    };
                }),
            // setting coutry name is mokup
            setCountryLable: (content) =>
                set((state) => {
                    state.selectedCountryLable = content;
                }),
            // set images
            setSingleImageContent: (content) =>
                set((state) => {
                    state.singleImageContent = {
                        ...state.imageUrl,
                        ...state.name, // Preserve existing structure
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ??
                            state.singleImageContent.buttons ??
                            [], // Ensure buttons array always exists
                    };
                }),
            // set carousel body
            setcarouselBodyContent: (content) =>
                set((state) => ({
                    carouselBodyContent: {
                        ...state.carouselBodyContent,
                        textMessage: content.textMessage,
                        variables: content.variables,
                    },
                })),
            // add variable in carousel body
            addcarouselBodyVariables: () =>
                set((state) => {
                    const nextVariableNumber =
                        state.carouselBodyContent.variables.length + 1;
                    const newVariable = `{{${nextVariableNumber}}}`;

                    return {
                        carouselBodyContent: {
                            textMessage: `${state.carouselBodyContent.textMessage} ${newVariable}`,
                            variables: [
                                ...state.carouselBodyContent.variables,
                                newVariable,
                            ],
                        },
                    };
                }),
            // set carousel items in cards
            setCarouselItems: (updatedItem) =>
                set((state) => {
                    const index = state.carouselItems.findIndex(
                        (item) => item.id === updatedItem.id
                    );
                    if (index !== -1) {
                        state.carouselItems[index] = {
                            ...state.carouselItems[index],
                            ...updatedItem,
                        };
                    }
                }),

            addCarouselCard: (card) =>
                set((state) => ({
                    carouselItems: [
                        ...state.carouselItems,
                        {
                            ...card,
                            id: state.carouselItems.length + 1,
                            buttons: [
                                {
                                    id: 1,
                                    suggestionType: "quick_reply",
                                    displayText: "",
                                    displayTextValue: "",
                                },
                                {
                                    id: 2,
                                    suggestionType: "url",
                                    displayText: "",
                                    displayTextValue: "",
                                },
                            ],
                        },
                    ],
                })),
            removeCarouselCard: (cardId) =>
                set((state) => ({
                    carouselItems: state.carouselItems.filter(
                        (card) => card.id !== cardId
                    ),
                })),

            setCarouelType: (content) =>
                set((state) => {
                    state.carouelType = content;
                }),
            setMediaType: (content) =>
                set((state) => {
                    state.mediaType = content;
                }),
            setVideoContent: (content) =>
                set((state) => {
                    state.videoContent = {
                        ...state.imageUrl,
                        ...state.name, // Preserve existing structure
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ?? state.videoContent.buttons ?? [], // Ensure buttons array always exists
                    };
                }),
            setDocumentContent: (content) =>
                set((state) => {
                    state.documentContent = {
                        ...state.imageUrl,
                        ...state.name, // Preserve existing structure
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ??
                            state.documentContent.buttons ??
                            [], // Ensure buttons array always exists
                    };
                }),
            setLocation: (content) =>
                set((state) => {
                    state.location = {
                        ...state.imageUrl,
                        ...state.name, // Preserve existing structure
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ?? state.location.buttons ?? [], // Ensure buttons array always exists
                    };
                }),
            // set lto content
            setLTO: (content) =>
                set((state) => {
                    state.LtoContent = {
                        ...state.textMessage,
                        ...content, // Merge new updates
                        buttons:
                            content.buttons ?? state.LtoContent.buttons ?? [], // Ensure buttons array always exists
                    };
                }),

            // Reset store
            resetStore: () => set(() => ({ ...initialState })),
        };
    })
);
