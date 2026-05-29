import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

export const getRCSContactsService = async (token, params = {}) => {
  try {
    const response = await axiosServerInstance.get(
      `/phonebook/contacts/rcs-list`,
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
      data: response.data.data,
      total: response.data.total,
      message: response.data.message,
    };
  } catch (error) {
    // Handle and return error response
    return {
      status: "ERROR",
      message: error.response?.data?.message || "Failed to get RCS contacts",
      error: error.response?.data || error,
    };
  }
};
