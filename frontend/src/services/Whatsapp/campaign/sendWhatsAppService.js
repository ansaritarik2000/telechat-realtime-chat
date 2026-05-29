import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// Service function to send whatapp message
export const sendWhatsappMessageService = async ({ token, data }) => {
    try {
        // Make the POST request to the backend with the provided data
        const response = await axiosServerInstance.post(
            `/whatsapp/campaign/sendwhatsapp`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Error in sending message",
            error: error.response?.data || error,
        };
    }
};

// This function is used for send test whatapp message service
export const sendTestWhatsappMessageService = async ({ token, data }) => {
    try {
        // Make the POST request to the backend with the provided data
        const response = await axiosServerInstance.post(
            `/whatsapp/campaign/sendwhatsapptest`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Error in sending message",
            error: error.response?.data || error,
        };
    }
};
