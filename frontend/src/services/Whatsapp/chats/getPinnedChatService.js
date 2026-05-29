// this service is used for get pinned chats
import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service is used for get pinned chats
export const getPinnedChatService = async (token) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/chat/getpinned`,
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
                error.response?.data?.message || "Failed to get pinned chats",
            error: error.response?.data || error,
        };
    }
};
