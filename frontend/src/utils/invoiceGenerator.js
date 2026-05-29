import axios from "axios";
import { backend_base_url } from "../services/common";
import { axiosServerInstance } from "./axios/config";

export const generateInvoice = async (invoiceData) => {
    try {
        const response = await axiosServerInstance.post(
            `/generate-invoice`,
            invoiceData,
            {
                responseType: "blob",
            }
        );

        // Create a URL for the PDF Blob
        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "invoice.pdf"); // Set the file name for download
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.parentNode.removeChild(link); // Clean up the link element

        console.log("Invoice downloaded successfully!");
    } catch (error) {
        console.error("Error downloading the invoice:", error);
        alert("Failed to generate the invoice. Please try again.");
    }
};
