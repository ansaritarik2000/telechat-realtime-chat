import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service function to get profile details
export const getProfileDetailsService = async (token) => {
    try {
        // Make GET request to the profile details endpoint
        const response = await axiosServerInstance.get(`/profile/details`, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in headers
            },
        });

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
                error.response?.data?.message ||
                "Failed to fetch profile details",
            error: error.response?.data || error,
        };
    }
};

// Service function to update profile
export const updateProfileService = async (profileData, token) => {
    try {
        // Make PUT request to the update profile endpoint
        const response = await axiosServerInstance.put(
            `/profile/updateprofile`,
            profileData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to update profile",
            error: error.response?.data || error,
        };
    }
};

// Service function to update ip info
export const updateIpInfoService = async (ipinfoData, token) => {
    try {
        // Make PUT request to the update ip info endpoint
        const response = await axiosServerInstance.put(
            `/profile/updateipinfo`,
            ipinfoData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to update ip info",
            error: error.response?.data || error,
        };
    }
};

// Service function to update password
export const updatePasswordService = async (passwordData, token) => {
    try {
        // Make PUT request to the update password endpoint
        const response = await axiosServerInstance.put(
            `/profile/updatepassword`,
            passwordData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to update password",
            error: error.response?.data || error,
        };
    }
};

// Service function to update security alert settings
export const updateSecurityAlertService = async (alertData, token) => {
    try {
        // Make PUT request to the update security alert settings endpoint
        const response = await axiosServerInstance.put(
            `/profile/twofactorauthandbalancedrop`,
            alertData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status || "SUCCESS",
            message: response.data.message || "Successfully updated settings",
            data: response?.data?.data,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                "Failed to update security alert settings",
            error: error.response?.data || error,
        };
    }
};

// Service function to update frequency cap details
export const updateFrequencyCapService = async (capData, token) => {
    try {
        // Make PUT request to the update frequency cap details endpoint
        const response = await axiosServerInstance.put(
            `/profile/updatefrequencycap`,
            capData,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in headers
                },
            }
        );

        // Return the response data on success
        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                "Failed to update frequency cap details",
            error: error.response?.data || error,
        };
    }
};
