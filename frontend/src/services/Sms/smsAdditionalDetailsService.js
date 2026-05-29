import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// this service function are used for get sms addtiontal details
const getSmsAdditionalDetailsService = async (campaign_id) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/sms-additional-details/${campaign_id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching SMS Additional details:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};

export { getSmsAdditionalDetailsService };
