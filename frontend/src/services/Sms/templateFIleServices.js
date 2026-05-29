import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service for uploading CSV and XLSX files for bulk template creation
export const bulkTemplateUploadService = async (file, entity_id, operator) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entity_id", entity_id);

        const response = await axiosServerInstance.post(
            `/sms/bulktemplatecreate`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        let message = "An unexpected error occurred.";
        if (error.response) {
            // Backend returned an error response
            message =
                error.response.data?.message ||
                JSON.stringify(error.response.data) ||
                "Server Error";
            console.error("Server Error:", error.response.data);
        } else if (error.request) {
            // No response received
            message = "No response from server. Please try again later.";
            console.error("No Response:", error.request);
        } else {
            // Other errors
            message = error.message || message;
            console.error("Error:", error.message);
        }
        throw new Error(message);
    }
};

// Service for uploading CSV and XLSX files for bulk header creation
export const bulkHeaderUploadService = async (file, entity_id) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("entity_id", entity_id);

        const response = await axiosServerInstance.post(
            `/sms/bulkheaderupload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (error) {
        let message = "An unexpected error occurred.";
        if (error.response) {
            // Extract the most meaningful error message from the response
            message =
                error.response.data?.message ||
                error.response.data?.error ||
                JSON.stringify(error.response.data) ||
                "Server Error";
            console.error("Server Error:", error.response.data);
        } else if (error.request) {
            message = "No response from server. Please try again later.";
            console.error("No Response:", error.request);
        } else {
            message = error.message || message;
            console.error("Error:", error.message);
        }
        throw new Error(message);
    }
};
