import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service function are used for get whatsapp addtiontal details
const getWhatsappAdditionalDetailsService = async (
    accessToken,
    campaign_id
) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/whatsapp-additional-details/${campaign_id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching WhatsApp Additional details:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

export { getWhatsappAdditionalDetailsService };
