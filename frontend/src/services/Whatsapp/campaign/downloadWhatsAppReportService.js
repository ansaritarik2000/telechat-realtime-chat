import axios from "axios";
import { backend_base_url } from "../../common";
import toast from "react-hot-toast";
import { axiosServerInstance } from "../../../utils/axios/config";

// Service function to download CSV file
export const exportToWhatsAppReportCSVservice = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/downloadcsv`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
                responseType: "blob", // Important to handle binary data
            }
        );
        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "WhatsApp_Campaigns.csv"); // File name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading CSV:", error);
        toast.error("Failed to download CSV. Please try again.");
    }
};

// Service function to download PDF file
export const exportToWhatsAppReportPDFservice = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/downloadpdf`,
            {
                params: {
                    ...params, // Pass any query parameters here
                },
                responseType: "blob", // Important to handle binary data
            }
        );

        // Create a link element to download the file
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "WhatsApp_Campaigns.pdf"); // File name for download
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.error("Error downloading PDF:", error);
        toast.error("Failed to download PDF. Please try again.");
    }
};

// this service use for download whatsapp-details csv format
export const downloadWhatsappDetailsCSVservice = async (
    campaignId,
    columns = "*"
) => {
    try {
        // Request to download the CSV file
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/downloaddetailscsv`,
            {
                params: { campaign_id: campaignId, columns },
                responseType: "blob", // Ensure the response is treated as a Blob for file download
            }
        );
        console.log("response", response);

        // Create a URL for the blob object
        const url = window.URL.createObjectURL(new Blob([response.data]));

        // Create a link element
        const link = document.createElement("a");
        link.href = url;

        // Set the download attribute with a file name
        link.setAttribute("download", "WhatsApp_Details.xlsx");

        // Append to the body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the link
        link.remove();
    } catch (error) {
        console.error("Error downloading WhatsApp Details CSV:", error);
        toast.error(
            "Failed to download WhatsApp Details CSV. Please try again."
        );
    }
};

// this service use for download whatsapp-details pdf format
export const downloadWhatsAppDetailsPDFservice = async (
    campaignId,
    columns = "*"
) => {
    try {
        // Request to download the PDF file
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/downloaddetailspdf`,
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
        link.setAttribute("download", "WhatsApp_Details.pdf");

        // Append to the body and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up the link
        link.remove();
    } catch (error) {
        console.error("Error downloading WhatsApp Details PDF:", error);
        toast.error(
            "Failed to download WhatsApp Details PDF. Please try again."
        );
    }
};
