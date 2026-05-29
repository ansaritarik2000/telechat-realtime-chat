import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// this function service calculate stats for particular compaign id
export const getRcsDetailsStats = async (campaignId) => {
    try {
        const response = await axiosServerInstance.get(`/rcs/details-stats`, {
            params: {
                campaign_id: campaignId,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching RCS details statistics:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

// this function service calculate stats for all campaign id
export const getRcsAllDetailsStats = async () => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/all-details-stats`
        );
        return response.data;
    } catch (error) {
        console.error(
            "Error fetching RCS overall statistics for all campaigns:",
            error
        );
        throw error; // Optionally throw error to handle it in the component
    }
};
