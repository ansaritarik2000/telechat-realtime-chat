import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// Service to get messages
export const getMessageService = async (receiver_id, sender_id, token) => {
    let req = {
        receiver_id: receiver_id,
        sender_id: sender_id,
    };
    try {
        // Ensure receiver_id and sender_id are provided
        if (!receiver_id || !sender_id) {
            throw new Error("receiver_id and sender_id are required");
        }

        const response = await axiosServerInstance.post(
            `/chating/getmessages`, // Endpoint URL
            req, // Pass the required body
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        console.log("Response:", response.data);
        return {
            status: response.data.status, // SUCCESS or ERROR
            data: response.data.data, // List of messages
            message: response.data.message, // Success message
        };
    } catch (error) {
        // Handle and return error response
        console.error("Error fetching messages:", error.message);
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Failed to get messages",
            error: error.response?.data || error, // Provide additional error details
        };
    }
};
