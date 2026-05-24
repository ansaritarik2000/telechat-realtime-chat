// 📁 src/services/group/getGroupByIdService.js
import { axiosServerInstance } from "../../../utils/axios/config";

export const getGroupByIdService = async (groupId, token) => {
  try {
    const response = await axiosServerInstance.get(`/telechat/group/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      status: response.data.status,
      group: response.data.group,
      members: response.data.members,
    };
  } catch (error) {
    console.error("Error fetching group by ID:", error);
    return {
      status: "ERROR",
      message: error?.response?.data?.message || "Failed to fetch group details",
    };
  }
};
