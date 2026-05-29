import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// Function to get Whatsapp reports campaigns
export const getWhatsAppReportService = async (token, params) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/getwhatsappreports`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching Whatsapp reports:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
