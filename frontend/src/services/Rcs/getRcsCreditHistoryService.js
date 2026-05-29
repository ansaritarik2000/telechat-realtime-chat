import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// This service function is used to get the RCS credit history of the user
export const getRcsCreditHistoryService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/rcs-credit-history`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching RCS credit history:", error);
        throw error; // Optionally throw error to handle it in the component
    }
};
