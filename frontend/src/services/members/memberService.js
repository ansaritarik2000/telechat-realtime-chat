import { axiosServerInstance } from "../../utils/axios/config";
const token = localStorage.getItem("token");

// Function to create a new member
export const createMemberService = async (memberData) => {
    try {
        const response = await axiosServerInstance.post(
            `/member/create`,
            memberData,
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
            message: error.response?.data?.message || "Failed to create member",
            error: error.response?.data || error,
        };
    }
};

// Service function to get members with pagination, search, and status filters
export const getMembersService = async (
    page,
    limit,
    status,
    search,
    token,
    user_id
) => {
    try {
        const response = await axiosServerInstance.get(`/member/list`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

            params: {
                page,
                limit,
                status,
                search,
                user_id,
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
                error.response?.data?.message || "Failed to retrieve members",
            error: error.response?.data || error,
        };
    }
};

// Service function to get active members
export const getActiveMembersService = async () => {
    try {
        const response = await axiosServerInstance.get(
            `/member/activemembers`,
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
                "Failed to retrieve active members",
            error: error.response?.data || error,
        };
    }
};

// Service function to get members with ip info
export const getMembersWithIpInfoService = async (token) => {
    try {
        const response = await axiosServerInstance.get(`/member/iplist`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
                "Failed to retrieve members with ip info.",
            error: error.response?.data || error,
        };
    }
};

// this service function is used get api call for member graph details
export const getGraphMemberService = async () => {
    try {
        const response = await axiosServerInstance.get(`/member/rolecount`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
            message: error.response?.data?.message || "Failed to retrieve data",
            error: error.response?.data || error,
        };
    }
};

// function service to trash account
export const deleteMemberService = async ({ user_id }) => {
    try {
        const response = await axiosServerInstance.put(
            `/member/trash`,
            { user_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Something went wrong",
            error: error.response?.data || error,
        };
    }
};

// update member service handller
export const updateMemberService = async (updatedData) => {
    try {
        const response = await axiosServerInstance.put(
            `/member/update`,
            updatedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return {
            status: response.data.status,
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
