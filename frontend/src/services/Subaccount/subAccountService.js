import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// authToken
const token = localStorage.getItem("token");

// Service function to create a sub-account
export const createSubAccountService = async (subAccountData, token) => {
    try {
        // console.log(subAccountData);
        const response = await axiosServerInstance.post(
            `/subaccount/create`,
            subAccountData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log(response);

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
                error.response?.data?.message || "Failed to create sub-account",
            error: error.response?.data || error,
        };
    }
};

// Service function to get sub-accounts with pagination
export const getSubAccountsService = async (
    page,
    limit,
    token,
    status,
    search
) => {
    try {
        const response = await axiosServerInstance.get(`/subaccount/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                limit,
                status,
                search,
            },
        });

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            pagination: response.data.pagination,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                "Failed to retrieve sub-accounts",
            error: error.response?.data || error,
        };
    }
};

// Service function to get sub-account details by user_id
export const getSubAccountByUserIdService = async (user_id) => {
    try {
        const response = await axiosServerInstance.get(
            `/subaccount/details/${user_id}`,
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
                error.response?.data?.message ||
                "Failed to retrieve sub-account details",
            error: error.response?.data || error,
        };
    }
};

// function to used for login subaccounter by creator
export const loginSubAccountService = async (loginData, token) => {
    try {
        // Make the POST request to the backend with login data
        const response = await axiosServerInstance.post(
            `/subaccount/login`,
            loginData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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

// function service to purg/trash account
export const purgSubAccountService = async (user_id) => {
    try {
        const response = await axiosServerInstance.put(
            `/subaccount/purg`,
            { user_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Error purg account",
            error: error.response?.data || error,
        };
    }
};

// configure/update subaccount handller
export const configureUpdateService = async (updatedData, token) => {
    try {
        const response = await axiosServerInstance.put(
            `/subaccount/configure`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Updating error.",
            error: error.response?.data || error,
        };
    }
};

// this service function is used for create transaction
export const createTransactionService = async (transactionData, token) => {
    try {
        const response = await axiosServerInstance.post(
            `/subaccount/transaction`,
            transactionData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Failed to create transaction",
            error: error.response?.data || error,
        };
    }
};

// Function to get user transactions with pagination
export const getUserTransactionsService = async (
    userId,
    token,
    page = 1,
    limit = 10
) => {
    try {
        const response = await axiosServerInstance.get(
            `/subaccount/transactions/${userId}?page=${page}&limit=${limit}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: "SUCCESS",
            message: "User transactions fetched successfully",
            data: response.data.data, // Extract transactions data
            pagination: response.data.pagination, // Extract pagination info
        };
    } catch (error) {
        console.error("Error fetching user transactions:", error);
        return {
            status: "ERROR",
            message: "Failed to fetch user transactions",
            error: error?.response?.data || error,
        };
    }
};
