import axios from "axios";
import { axiosServerInstance } from "../../../../../utils/axios/config";

export const sendTemplatesForApproval = async (data) => {
    try {
        const response = await axiosServerInstance.post(
            "/whatsapp/template/send",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        );
        console.log("✅ Success: for Template approved sent", response.data);
        const metaId = response?.data.id;
        return {
            message: "Template Sent Successfully",
            success: true,
            metaId,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to send template",
        };
    }
};

export const sendTemplateBackend = async (data) => {
    try {
        const response = await axiosServerInstance.post(
            "/whatsapp/template/approval",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        );

        console.log("✅ Success:", response.data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to send template",
        };
    }
};

export const getTemplateData = async () => {
    try {
        const response = await axiosServerInstance.get(
            "/whatsapp/template/approval"
        );
        const result = response.data;
        return result;
    } catch (error) {
        console.log(error);
        return {
            status: "Failed",
            message: "Getting error to get template data",
        };
    }
};
// update the supabase record for the metaid corresponding supbase id



export const mediaId ="4::aW1hZ2UvcG5n:ARZ91D2Y8pNLRI4kWqonskbrKK-6cTj9T-P5PL6riONliSVzsnvsa86p1ojHt1-JQ_xJ4xLOEgSRGLuKlBQ4V0Tq9UYeE9CkMDpcG4ozfzRHCw:e:1744168027:1849455295211775:61564973734150:ARbEyH8en8S_DQC3cao"

