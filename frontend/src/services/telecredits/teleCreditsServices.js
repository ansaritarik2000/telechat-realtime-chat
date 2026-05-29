import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// this service is used for save telecredits
export const saveTeleCreditsService = async ({ params, token }) => {
    try {
        const response = await axiosServerInstance.post(
            `/telecredits/save`,
            params,
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
                error.response?.data?.message || "Failed to save telecredits",
            error: error.response?.data || error,
        };
    }
};

// this service is used for get telecredits
export const getTeleCreditsService = async ({ params, token }) => {
    try {
        const response = await axiosServerInstance.get(`/telecredits/list`, {
            params: {
                ...params, // Pass any query parameters here
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            totalRecords: response.data.totalCount,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to get telecredits",
            error: error.response?.data || error,
        };
    }
};

// this service is used for get telecredits uses
export const getTeleCreditsUsesService = async ({ params, token }) => {
    try {
        const response = await axiosServerInstance.get(`/telecredits/uses`, {
            params: {
                ...params, // Pass any query parameters here
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            totalCount: response.data.totalCount,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                "Failed to get telecredits uses",
            error: error.response?.data || error,
        };
    }
};
