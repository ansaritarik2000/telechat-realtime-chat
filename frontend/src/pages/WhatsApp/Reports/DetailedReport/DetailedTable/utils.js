

import { axiosServerInstance } from "../../../../../utils/axios/config";
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getWhatsappAdditionalDetails = async (campaign_id) => {
  try {
      const response = await axiosServerInstance.get(`/whatsapp/template/campaignReport`,{
            params:{campaign_id}
          }
      );
      // console.log(response.data.Campaign,campaign_id)
      return response.data;
  } catch (error) {
      console.error("Error fetching WhatsApp Additional details:", error);
      throw error; // Optionally throw error to handle it in the component
  }
};

export const getWhatsappStats = async (campaign_id) => {

  try {
      const response = await axiosServerInstance.get(`/whatsapp/template/campaignStats`,{
            params:{campaign_id}
          }
      );
      return response.data;
  } catch (error) {
      console.error("Error fetching WhatsApp Additional details:", error);
      throw error; // Optionally throw error to handle it in the component
  }
};

export const downloadSingleWADetailsPDFservice = async (campaign_id) => {
  try {
    // Request to download the PDF file
    const response = await axiosServerInstance.get(`/whatsapp/credit/detailsPdf`,
       {
      params: {campaign_id},
      responseType: "blob", // Ensure the response is treated as a Blob for file download
    });

    // Create a URL for the blob object
    // console.log("downloaddetailspdf",response)
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


// this service use for download rcs-details csv format
export const downloadWADetailsCSVservice = async (
  campaignId,
  columns = "*"
) => {
  try {
      // Request to download the CSV file
      const response = await axiosServerInstance.get(
          `/whatsapp/credit/detailsCSV`,
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
      link.setAttribute("download", "WhatsApp_Details.csv");

      // Append to the body and trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up the link
      link.remove();
  } catch (error) {
      alert("Failed to download WhatsApp Details CSV. Please try again.");
  }
};
