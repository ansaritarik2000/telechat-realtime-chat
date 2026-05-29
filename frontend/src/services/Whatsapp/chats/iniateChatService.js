// this service is used for initate chats
import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service is used for initate chats
export const initiateChatService = async (token, data) => {
    try {
        const response = await axiosServerInstance.post(
            `/whatsapp/chat/initiate-chat`,
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
            total: response.data.total,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to initiate chats",
            error: error.response?.data || error,
        };
    }
};
