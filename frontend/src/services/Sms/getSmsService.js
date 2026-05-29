import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Function to get SMS campaigns
export const getSMSCampaigns = async (params) => {
    try {
        const response = await axiosServerInstance.get(`/sms/getsms`, {
            params: {
                ...params, // Pass any query parameters here
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching SMS campaigns:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
