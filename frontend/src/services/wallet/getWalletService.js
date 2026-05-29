import { axiosServerInstance } from "../../utils/axios/config";
import { backend_base_url } from "../common";
import axios from "axios";

// This service function is used to get wallet details
export const getWalletDetailsService = async (params, token) => {
    try {
        const response = await axiosServerInstance.get(
            `/wallet/walletbanlance`,
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
        console.error("Error fetching wallet details:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
