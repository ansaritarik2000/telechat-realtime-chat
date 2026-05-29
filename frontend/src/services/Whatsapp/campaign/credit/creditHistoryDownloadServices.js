import { axiosServerInstance } from "../../../../utils/axios/config";


export const downloadWADetailsPDFservice = async () => {
  try {
    // Request to download the PDF file
    const response = await axiosServerInstance.get(`/whatsapp/credit/pdf`, {
      responseType: "blob", // Ensure the response is treated as a Blob for file download
    });

    // Create a URL for the blob object
    console.log("downloaddetailspdf",response)
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
    alert("Failed to download WhatsApp Details PDF. Please try again.");
  }
};