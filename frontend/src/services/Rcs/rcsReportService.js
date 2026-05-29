import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Get paginated RCS templates for report with optional search and status filters
export const getRcsTemplateReportServices = async (params) => {
    try {
        const response = await axiosServerInstance.get(`/rcs/report-template`, {
            params: {
                ...params, // Pass any query parameters here
            },
        });

        // Return the paginated data along with pagination info
        return response.data;
    } catch (error) {
        console.error("Error fetching RCS templates for report:", error);
        throw error;
    }
};
