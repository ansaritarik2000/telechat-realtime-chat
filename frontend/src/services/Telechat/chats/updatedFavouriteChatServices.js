// this service is used for pin chat
import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service is used for pin/unpin chat
export const updatedFavouriteChatServices = async (token, data) => {
    try {
        const response = await axiosServerInstance.put(
            `/telechat/chat/updatefavouritechat`,
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
                error.response?.data?.message || "Failed to favourite chat",
            error: error.response?.data || error,
        };
    }
};
