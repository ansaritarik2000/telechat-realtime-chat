import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service for downloading header and template CSV
export const downloadHeaderTempCSVService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/downloadheaderandtemplatecsv`,
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
        link.setAttribute("download", `sms_header_templates.csv`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading header and templates CSV:", error);
        throw error;
    }
};

// Service for downloading header templates PDF
export const downloadHeaderTempPDFService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/downloadheaderandtemplatepdf`,
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
        link.setAttribute("download", `sms_header_templates.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading header and templates PDF:", error);
        throw error;
    }
};

// Service for downloading header  CSV
export const downloadHeaderCSVService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/download-headers-csv`,
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
        link.setAttribute("download", `sms_header.csv`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading header and headers CSV:", error);
        throw error;
    }
};

// Service for downloading header  PDF
export const downloadHeaderPDFService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/download-headers-pdf`,
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
        link.setAttribute("download", `sms_headers.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading header PDF:", error);
        throw error;
    }
};
