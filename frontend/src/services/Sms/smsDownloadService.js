import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Service function to download CSV file
export const exportToCSVservice = async () => {
    try {
        const response = await axiosServerInstance.get(`/sms/downloadedcsv`, {
            responseType: "blob", // Important to handle binary data
        });

        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "SMS_Campaigns.csv"); // File name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading CSV:", error);
        alert("Failed to download CSV. Please try again.");
    }
};

// Service function to download PDF file
export const exportToPDFservice = async () => {
    try {
        const response = await axiosServerInstance.get(`/sms/downloadedpdf`, {
            responseType: "blob", // Important to handle binary data
        });

        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "SMS_Campaigns.pdf"); // File name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading PDF:", error);
        alert("Failed to download PDF. Please try again.");
    }
};

// this service use for download AllSMSdetails csv format
export const downloadAllSmsDetailsCSVservice = async (
    campaignId,
    columns = "*"
) => {
    try {
        // Request to download the CSV file
        const response = await axiosServerInstance.get(
            `/sms/downloaddetailscsv`,
            {
                params: { campaign_id: campaignId, columns },
                responseType: "blob", // Ensure the response is treated as a Blob for file download
            }
        );

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element
        const link = document.createElement("a");
        link.href = url;

        // Set the download attribute with a file name
        link.setAttribute("download", "SMS_Details.csv");

        // Append to the body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the link
        link.remove();
    } catch (error) {
        console.error("Error downloading All SMS Details CSV:", error);
        alert("Failed to download All SMS Details CSV. Please try again.");
    }
};

// this service use for download AllSMSdetails pdf format
export const downloadAllSmsDetailsPDFservice = async (
    campaignId,
    columns = "*"
) => {
    try {
        // Request to download the PDF file
        const response = await axiosServerInstance.get(
            `/sms/downloaddetailspdf`,
            {
                params: { campaign_id: campaignId, columns },
                responseType: "blob", // Ensure the response is treated as a Blob for file download
            }
        );

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element
        const link = document.createElement("a");
        link.href = url;

        // Set the download attribute with a file name
        link.setAttribute("download", "SMS_Details.pdf");

        // Append to the body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the link
        link.remove();
    } catch (error) {
        console.error("Error downloading All SMS Details PDF:", error);
        alert("Failed to download All SMS Details PDF. Please try again.");
    }
};
