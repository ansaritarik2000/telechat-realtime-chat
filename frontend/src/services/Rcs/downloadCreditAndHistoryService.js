import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service for downloading template CSV
export const downloadTemplateCSVService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/download-credit-history-csv`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
                responseType: "blob", // Important to handle binary data
            }
        );

        // Create a blob URL and download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `rcs_credit_history.csv`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading rcs credit history CSV:", error);
        throw error;
    }
};

// Service for downloading template PDF
export const downloadRcsCreditHistoryPdfService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/download-credit-history-pdf`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
                responseType: "blob", // Important to handle binary data
            }
        );

        // Create a blob URL and download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `rcs_credit_history.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading Credit History PDF:", error);
        throw error;
    }
};
