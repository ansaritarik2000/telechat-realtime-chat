// this function is used for send rcs text chats

import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this function is used for send rcs text chats
export const rcsInboxTextChatService = async ({ rcsData, token }) => {
    try {
        // Make the POST request to the backend with the provided RCS data
        const response = await axiosServerInstance.post(
            `/rcsinbox/text/chat`,
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

// this function is used for get rcs text chats
export const getRcsTextChatService = async ({
    contactNumber,
    token,
    page = 1,
    limit = 10,
}) => {
    try {
        // Make the GET request to the backend with the provided contact number
        const response = await axiosServerInstance.get(
            `/rcsinbox/text/get/${contactNumber}?page=${page}&limit=${limit}`,
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
            message: error.response?.data?.message || "Error in getting RCS",
            error: error.response?.data || error,
        };
    }
};
