import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service function to send SMS data
export const sendSMSservice = async (smsData) => {
    try {
        // Make the POST request to the backend with the provided SMS data
        const response = await axiosServerInstance.post(
            `/sms/sendsms`,
            smsData
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
            message: error.response?.data?.message || "Error in sending SMS",
            error: error.response?.data || error,
        };
    }
};

// Service function to send a test SMS campaign with a limit of 10 phone numbers
export const sendTestSMSservice = async (smsData) => {
    try {
        // Check if phone numbers are provided and if they exceed the limit
        if (smsData.phone_numbers?.length > 5) {
            return {
                status: "ERROR",
                message:
                    "You can only send to a maximum of 5 phone numbers for a test campaign",
            };
        }

        // Make the POST request to the backend with the provided SMS data
        const response = await axiosServerInstance.post(
            `/sms/sendsmstest`, // Ensure this is the test route
            smsData
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
                error.response?.data?.message || "Error in sending test SMS",
            error: error.response?.data || error,
        };
    }
};
