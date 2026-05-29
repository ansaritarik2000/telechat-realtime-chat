import { axiosServerInstance } from "../../utils/axios/config";

// This service function is used to get the SMS credit history of the user
export const getSmsCreditHistoryService = async (params) => {
    try {
        const response = await axiosServerInstance.get(`/sms/credit-history`, {
            params: {
                ...params, // Pass any query parameters here
            },
        });
        if (response?.data?.status === "SUCCESS") {
            return {
                status: "SUCCESS",
                data: response.data.data,
                message: response.data.message,
                totalRecords: response.data.totalRecords,
            };
        } else {
            return {
                status: "ERROR",
                data: response.data.data || [],

                message:
                    response.data.message ||
                    "Error fetching SMS credit history.",
            };
        }
    } catch (error) {
        console.error("Error fetching SMS credit history:", error);
        return {
            status: "ERROR",
            data: error.response.data || [],
            message:
                error.response.data.message ||
                "Error fetching SMS credit history.",
        };
    }
};
