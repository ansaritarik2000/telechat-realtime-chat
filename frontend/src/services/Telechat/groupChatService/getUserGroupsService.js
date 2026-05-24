import { axiosServerInstance } from "../../../utils/axios/config"; // Assuming your custom axios instance is here

export const getUserGroupsService = async (token) => {
  try {
    // Make the API call using your custom axios instance
    const response = await axiosServerInstance.get(`/telechat/group/groupuser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("✅ Group API response:", response.data);
    return {
      status: response.data.status,
      groups: response.data.groups,
    };
  } catch (error) {
    console.error("Error fetching user groups:", error);
    return {
      status: "ERROR",
      message: "Failed to fetch user groups",
    };
  }
};
