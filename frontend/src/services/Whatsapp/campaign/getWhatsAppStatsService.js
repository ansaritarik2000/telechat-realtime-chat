import { axiosServerInstance } from "../../../utils/axios/config";
import { backend_base_url } from "../../common";
import axios from "axios";
// this function service calculate stats for particular compaign id
export const getWhatsAppDetailsStatsService = async (campaignId) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/details-stats`,
            {
                params: {
                    campaign_id: campaignId,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching WhatsApp details statistics:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
