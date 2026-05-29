import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service function to send RCS data
export const sendRCSservice = async (rcsData) => {
    // Make the POST request to the backend with the provided RCS data
    const response = await axiosServerInstance.post(`/rcs/sendrcs`, rcsData);

    // Return the response data on success
    return {
        status: response.data.status,
        data: response.data.data,
        message: response.data.message,
    };
};

// Service function to send a test RCS campaign with a limit of 10 phone numbers
export const sendTestRCSservice = async (rcsData) => {
    try {
        // Check if phone numbers are provided and if they exceed the limit
        if (rcsData.phone_numbers?.length > 10) {
            return {
                status: "ERROR",
                message:
                    "You can only send to a maximum of 10 phone numbers for a test campaign",
            };
        }

        // Make the POST request to the backend with the provided RCS data
        const response = await axiosServerInstance.post(
            `/rcs/sendrcstest`, // Ensure this is the test route
            rcsData
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
                error.response?.data?.message || "Error in sending test RCS",
            error: error.response?.data || error,
        };
    }
};
