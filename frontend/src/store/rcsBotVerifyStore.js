import { create } from "zustand";
import { immer } from "zustand/middleware/immer"; // For immutability

export const useRcsBotVerifyStore = create(
    immer((set) => {
        const initialState = {
            pointOfContacts: [
                {
                    id: 1,
                    firstName: "",
                    lastName: "",
                    designation: "",
                    email: "",
                    mobile: "",
                },
            ],

            brandName: "",
            botId: "",
            videoUrl: "",
            botAccessInstructions: "",
            triggerAction: "",
            botInteractionTypes: "",
            webhookUrl: "",
            optInMessage: "",
            optOutMessage: "",
            optOutKeywords: "",
            revokeOptOut: "",
            revokeOptOutMessage: "",
            revokeOptOutKeywords: "",
            brandDetails: "",
            screenImages: [],
            screenImagesFileNames: [],
            panCard: "",
            panCardFileName: "",
            aadharCard: "",
            aadharCardFileName: "",
            industryId: "",
            industryType: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            zipCode: "",
            countryIso: "",
            contactFirstName: "",
            contactLastName: "",
            contactDesignation: "",
            email: "",
            mobile: "",
            brandWebsite: "",
            brandLogoUrl: "",
        };

        return {
            // State
            ...initialState,
            // Setter for updating pointOfContacts
            setPointOfContacts: (updateFn) =>
                set((state) => {
                    state.pointOfContacts = updateFn(state.pointOfContacts);
                }),
            setBrandName: (brandName) =>
                set((state) => {
                    state.brandName = brandName;
                }),
            setBotId: (botId) =>
                set((state) => {
                    state.botId = botId;
                }),
            setVideoUrl: (videoUrl) =>
                set((state) => {
                    state.videoUrl = videoUrl;
                }),
            setBotAccessInstructions: (botAccessInstructions) =>
                set((state) => {
                    state.botAccessInstructions = botAccessInstructions;
                }),
            setTriggerAction: (triggerAction) =>
                set((state) => {
                    state.triggerAction = triggerAction;
                }),
            setBotInteractionTypes: (botInteractionTypes) =>
                set((state) => {
                    state.botInteractionTypes = botInteractionTypes;
                }),
            setWebhookUrl: (webhookUrl) =>
                set((state) => {
                    state.webhookUrl = webhookUrl;
                }),
            setOptInMessage: (optInMessage) =>
                set((state) => {
                    state.optInMessage = optInMessage;
                }),
            setOptOutMessage: (optOutMessage) =>
                set((state) => {
                    state.optOutMessage = optOutMessage;
                }),
            setOptOutKeywords: (optOutKeywords) =>
                set((state) => {
                    state.optOutKeywords = optOutKeywords;
                }),
            setRevokeOptOut: (revokeOptOut) =>
                set((state) => {
                    state.revokeOptOut = revokeOptOut;
                }),
            setRevokeOptOutMessage: (revokeOptOutMessage) =>
                set((state) => {
                    state.revokeOptOutMessage = revokeOptOutMessage;
                }),
            setRevokeOptOutKeywords: (revokeOptOutKeywords) =>
                set((state) => {
                    state.revokeOptOutKeywords = revokeOptOutKeywords;
                }),
            setBrandDetails: (brandDetails) =>
                set((state) => {
                    state.brandDetails = brandDetails;
                }),
            setScreenImages: (screenImages) =>
                set((state) => {
                    state.screenImages = screenImages;
                }),
            setScreenImagesFileNames: (imageFileNames) =>
                set((state) => {
                    state.screenImagesFileNames = imageFileNames;
                }),
            setPanCard: (panCard) =>
                set((state) => {
                    state.panCard = panCard;
                }),
            setPanCardFileName: (panCardFileName) =>
                set((state) => {
                    state.panCardFileName = panCardFileName;
                }),
            setAadharCard: (aadharCard) =>
                set((state) => {
                    state.aadharCard = aadharCard;
                }),
            setAadharCardFileName: (aadharCardFileName) =>
                set((state) => {
                    state.aadharCardFileName = aadharCardFileName;
                }),
            setIndustryId: (industryId) =>
                set((state) => {
                    state.industryId = industryId;
                }),
            setIndustryType: (industryType) =>
                set((state) => {
                    state.industryType = industryType;
                }),
            setAddressLine1: (addressLine1) =>
                set((state) => {
                    state.addressLine1 = addressLine1;
                }),
            setAddressLine2: (addressLine2) =>
                set((state) => {
                    state.addressLine2 = addressLine2;
                }),
            setCity: (city) =>
                set((state) => {
                    state.city = city;
                }),
            setState: (state) =>
                set((bot) => {
                    bot.state = state;
                }),
            setZipCode: (zipCode) =>
                set((state) => {
                    state.zipCode = zipCode;
                }),
            setCountryIso: (countryIso) =>
                set((state) => {
                    state.countryIso = countryIso;
                }),
            setContactFirstName: (contactFirstName) =>
                set((state) => {
                    state.contactFirstName = contactFirstName;
                }),
            setContactLastName: (contactLastName) =>
                set((state) => {
                    state.contactLastName = contactLastName;
                }),
            setContactDesignation: (contactDesignation) =>
                set((state) => {
                    state.contactDesignation = contactDesignation;
                }),
            setEmail: (email) =>
                set((state) => {
                    state.email = email;
                }),
            setMobile: (mobile) =>
                set((state) => {
                    state.mobile = mobile;
                }),
            setBrandWebsite: (brandWebsite) =>
                set((state) => {
                    state.brandWebsite = brandWebsite;
                }),
            setBrandLogoUrl: (brandLogoUrl) =>
                set((state) => {
                    state.brandLogoUrl = brandLogoUrl;
                }),
        };
    })
);
