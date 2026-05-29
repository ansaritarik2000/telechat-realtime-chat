// this function is used for send rcs template chats

import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

export const rcsInboxChatService = async ({ rcsData, token }) => {
    try {
        // Make the POST request to the backend with the provided RCS data
        const response = await axiosServerInstance.post(
            `/rcsinbox/template/chat`,
            rcsData,
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
            message: error.response?.data?.message || "Error in sending RCS",
            error: error.response?.data || error,
        };
    }
};
