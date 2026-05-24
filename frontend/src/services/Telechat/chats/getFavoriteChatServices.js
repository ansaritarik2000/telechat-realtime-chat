import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// Service to get favourited chats
export const getFavouriteChatService = async (token) => {
    try {
        const response = await axiosServerInstance.get(
            `/telechat/chat/favourite`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        // console.log("hhhhhh", response)
        return {
            status: response.data.status, // SUCCESS or ERROR
            data: response.data.data, // List of favourited chats
            message: response.data.message, // Any success message
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                "Failed to get favourited chats",
            error: error.response?.data || error, // Provide additional error details
        };
    }
};
