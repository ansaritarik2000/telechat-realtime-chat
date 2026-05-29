// Store created fot emailCampaign
import { create } from "zustand";
import axios from "axios";
import { axiosServerInstance } from "../../utils/axios/config";

//
const emailCampaingnStore = create((set) => ({
    // initial state of store
    emailCampaingnData: {
        campaignName: "182947-Email Campaign (12 December 2024 4:20PM)",
        campaignID: "",
        targetEmails: [],
        status: null,
        deliveredCredits: null,
        submittedCredits: null,
        emailID: null,
        templateType: null,
        templateName: null,
        subjectLine: "",
        testEmail: [],
        AB_Subject: [],
        date: null,
        timezone: null,
        batchSize: null,
        Interval: "0 minutes",
        csvFileContent: {},
        validEmails: [],
        phoneGroupEmails: [],
        targetedAudience: 0,
    },
    selectedDate: null,
    select: true,
    EmailDashboard: [],

    // Seting the data from input field of email campaingn
    setEmailCampaingnData: (key, value) => {
        set((state) => ({
            emailCampaingnData: {
                ...state.emailCampaingnData,
                [key]: value,
            },
        }));
    },

    // Clear the data from input field of email campaingn
    resetEmailCamaingData: () => {
        set(() => ({
            emailCampaingnData: {
                campaignName: "",
                campaignID: "",
                targetEmails: [],
                status: null,
                deliveredCredits: null,
                submittedCredits: null,
                emailID: null,
                templateType: null,
                templateName: null,
                subjectLine: "",
                testEmail: [],
                AB_Subject: [],
                date: null,
                timezone: null,
                batchSize: null,
                Interval: "",
                csvFileContent: {},
                validEmails: [],
                phoneGroupEmails: [],
                targetedAudience: 0,
            },
            selectedDateRange: null,
        }));
    },

    // sending the email campaign data
    sendDataToBackend: async () => {
        const { emailCampaingnData } = emailCampaingnStore.getState();
        const updatedData = {
            ...emailCampaingnData,
            status: Math.random() > 0.5 ? "Pending" : "Completed",
            deliveredCredits: Math.floor(Math.random() * 10) + 1,
            submittedCredits: Math.floor(Math.random() * 5) + 1,
        };
        console.log("Data being sent to backend:", updatedData);
        try {
            const result = axiosServerInstance.post(
                "/email/emailSend",
                updatedData
            );
            console.log("Data getting", result);
        } catch (error) {
            console.error("Error sending data to backend:", error.message);
            return error.message;
        }
    },

    // Getting the data from backend
    getDataFromBackend: async () => {
        try {
            const res = axiosServerInstance.get("/email/campaignData");
            return res.data;
        } catch (error) {
            console.error("Error sending data to backend:", error.message);
            return error.message;
        }
    },
    // Geting the date from input field of email campaingn
    setSelectedDateRange: (date) =>
        set((state) => ({ ...state, selectedDate: date })),

    onSelect: (key) => set((state) => ({ select: key })),

    setEmailDashboard: (data) =>
        set(() => ({
            EmailDashboard: data,
        })),
}));

export default emailCampaingnStore;
