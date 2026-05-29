import { axiosServerInstance } from "../../utils/axios/config";

// this service function is used for create group
export const createGroupService = async (groupData, token) => {
    try {
        const response = await axiosServerInstance.post(
            `/phonebook/group/create`,
            groupData,
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
            message: error.response?.data?.message || "Failed to create group",
            error: error.response?.data || error,
        };
    }
};

// this service function is used for get group contacts
export const getGroupContactsService = async (parmas, token) => {
    try {
        const response = await axiosServerInstance.get(
            `/phonebook/group/contacts`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: parmas,
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
                error.response?.data?.message || "Failed to get group contacts",
            error: error.response?.data || error,
        };
    }
};

// this service function is used for update group
export const updateGroupService = async (groupData, token) => {
    try {
        const response = await axiosServerInstance.put(
            `/phonebook/group/update`,
            groupData,
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
            message: error.response?.data?.message || "Failed to update group",
            error: error.response?.data || error,
        };
    }
};

// This service function is used to create a group from an Excel file
export const createGroupFromExcelService = async (file, token, bodyData) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        // Append other fields to the FormData object
        for (const [key, value] of Object.entries(bodyData)) {
            formData.append(key, value);
        }

        const response = await axiosServerInstance.post(
            `/phonebook/group/create-from-excel`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data", // Ensure correct content type
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
                "Failed to create group from excel",
            error: error.response?.data || error,
        };
    }
};

// this service function is used for get groups
export const getGroupsService = async (token, params) => {
    const response = await axiosServerInstance.get(`/phonebook/group/list`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: params,
    });

    // Return the response data on success
    return {
        status: response.data.status,
        data: response.data.data,
        message: response.data.message,
    };
};

// this service function is used for get group contacts by group ids
export const getGroupContactsByGroupIdsService = async (token, params) => {
    const response = await axiosServerInstance.get(
        `/phonebook/group/contacts-by-group-ids`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: params,
        }
    );

    // Return the response data on success
    return {
        status: response.data.status,
        total: response.data.total,
        data: response.data.data,
        message: response.data.message,
    };
};

// this service function is used for delete group
export const deleteGroupService = async (groupId, token) => {
    try {
        const response = await axiosServerInstance.delete(
            `/phonebook/group/delete`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { id: groupId },
            }
        );

        return {
            status: response.data.status,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: error.response?.data?.message || "Failed to delete group",
            error: error.response?.data || error,
        };
    }
};
