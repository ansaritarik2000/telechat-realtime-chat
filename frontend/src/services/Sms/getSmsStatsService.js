import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// this function service calculate stats for sms particular compaign id
export const getSmsDetailsStats = async (campaignId) => {
    try {
        const response = await axiosServerInstance.get(`/sms/details-stats`, {
            params: {
                campaign_id: campaignId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching SMS details statistics:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

// this function service calculate stats for all campaign id
export const getSmsAllDetailsStats = async () => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/all-details-stats`
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching SMS overall statistics for all campaigns:",
            error
        );
        throw error; // Optionally throw error to handle it in the component
    }
};
