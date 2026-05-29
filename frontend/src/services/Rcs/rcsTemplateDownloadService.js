import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service for downloading template CSV
export const downloadTemplateCSVService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/download-template-csv`,
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
        link.setAttribute("download", `template_rcs.csv`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading template CSV:", error);
        throw error;
    }
};

// Service for downloading template PDF
export const downloadTemplatePDFService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/download-template-pdf`,
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
        link.setAttribute("download", `template_rcs.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading template PDF:", error);
        throw error;
    }
};

// Service for downloading template JSON
export const downloadTemplateJSONService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/download-template-json`,
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
        link.setAttribute("download", `template_rcs.json`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading template JSON:", error);
        throw error;
    }
};
