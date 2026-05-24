import { axiosServerInstance } from "../../../utils/axios/config";

export const getGroupMembersService = async (groupId, token) => {
  try {
    const response = await axiosServerInstance.get(`/telechat/group/${groupId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: response.data.status,
      members: response.data.members,
    };
  } catch (error) {
    console.error("Error fetching group members:", error);
    return {
      status: "ERROR",
      message: "Failed to fetch group members",
    };
  }
};
