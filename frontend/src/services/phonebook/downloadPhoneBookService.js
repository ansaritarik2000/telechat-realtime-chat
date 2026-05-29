import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service for downloading phonebook CSV
export const downloadPhonebookCSVService = async (params, token) => {
    try {
        const response = await axiosServerInstance.get(
            `/phonebook/download-phonebook-csv`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        link.setAttribute("download", `contacts.csv`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading phonebook contacts CSV:", error);
        throw error;
    }
};

// Service for downloading template PDF
export const downloadPhonebookPDFService = async (params, token) => {
    try {
        const response = await axiosServerInstance.get(
            `/phonebook/download-phonebook-pdf`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
        link.setAttribute("download", `phonebook.pdf`); // File name
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading phonebook contacts PDF:", error);
        throw error;
    }
};
