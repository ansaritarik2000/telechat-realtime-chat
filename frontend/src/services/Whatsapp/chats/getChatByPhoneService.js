// this service is used for get chat by id
import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service is used for get chat by phone number
export const getChatByPhoneNumberService = async (token, phone_number) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/chat/get/${phone_number}`,
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
                error.response?.data?.message || "Failed to get chat by id",
            error: error.response?.data || error,
        };
    }
};
