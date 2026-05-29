import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Function to create RCS bot
export const createBotService = async (token, botData) => {
  try {
    const response = await axiosServerInstance.post(
      `/rcs/create-bot`,
      botData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating bot:", error);
    throw error;
  }
};

// Function to verify bot
export const verifyBotService = async (token, formData) => {
  try {
    const response = await axiosServerInstance.post(
      `/rcs/verify-bot`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      status: "SUCCESS",
      message:
        response.data.message ||
        "Business verification details submitted successfully.",
      data: response.data,
    };
  } catch (error) {
    return {
      status: "ERROR",
      message:
        error.response.data.message ||
        "Error submitting business verification details.",
      data: error.response.data,
    };
  }
};

// Function to get RCS campaigns
export const getRCSBots = async (params) => {
  const response = await axiosServerInstance.get(`/rcs/bots`);
  return response.data;
};

// Function to get RCS bots with search and status filters
export const getRCSReportBots = async (params = {}) => {
  try {
    const { page = 1, limit = 5, search = "", status = "" } = params;
    const response = await axiosServerInstance.get(`/rcs/report-bots`, {
      params: {
        page,
        limit,
        search,
        status,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching RCS Report bots:", error);
    throw error; // Optionally throw error to handle it in the component
  }
};

// Delete multiple bots based on bot IDs
export const deleteBotsService = async (botIds) => {
  try {
    const response = await axiosServerInstance.delete(`/rcs/delete-bots`, {
      data: { botIds }, // Pass the bot IDs in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting bots:", error);
    throw error;
  }
};
