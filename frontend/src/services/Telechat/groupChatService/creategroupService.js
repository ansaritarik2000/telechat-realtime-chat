import { axiosServerInstance } from "../../../utils/axios/config";


export const createGroupService = async ({ groupName, members, isPrivate, token }) => {
    // Validate token before making the request
    if (!token) {
        return {
            status: "ERROR",
            message: "Authorization token is missing.",
        };
    }

    // Validate members
    const uniqueMembers = [...new Set(members.map(Number))].filter(id => !isNaN(id));
    if (!groupName || uniqueMembers.length < 2) {
        return {
            status: "ERROR",
            message: "Group must have a name and at least 2 unique members.",
        };
    }

    const reqData = {
        groupName,
        members: uniqueMembers,
        isPrivate: !!isPrivate,
    };

    try {
        const response = await axiosServerInstance.post(
            `/telechat/group/create`,
            reqData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Group Create Response:", response.data);

        return {
            status: response.data.status,
            data: response.data.group,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Error creating group:", error);
        return {
            status: "ERROR",
            message:
                error.response?.data?.message ||
                error.message ||
                "Failed to create group",
        };
    }
};
