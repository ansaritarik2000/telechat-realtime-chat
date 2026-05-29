import { axiosServerInstance } from "../../utils/axios/config";

// Service function for user login
export const loginService = async (loginData) => {
    try {
        // Make the POST request to the backend with login data
        const response = await axiosServerInstance.post(
            `/auth/login`,
            loginData
        );
        console.log("response",response)
        // Return the response data on success, including the token
        return {
            status: response.data.status,
            token: response.data.token, // JWT token from the response
            user: response.data.user, // User details from the response
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Login failed",
            error: error.response?.data || error,
        };
    }
};
