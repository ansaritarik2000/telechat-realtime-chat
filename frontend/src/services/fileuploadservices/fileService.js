import { axiosServerInstance } from "../../utils/axios/config";

// this service for upload xlsx and csv file
export const uploadFileService = async (file) => {
  // Prepare the form data
  const formData = new FormData();
  formData.append("file", file);
  // Make the POST request to the server's upload endpoint
  const response = await axiosServerInstance.post(`/file/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  
  return response.data;
};

export const uploadFileServiceEmails = async (file) => {
  try {
    // Prepare the form data
    const formData = new FormData();
    formData.append("file", file);
    // Make the POST request to the server's upload endpoint
    const response = await axiosServerInstance.post(
      `/email/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Handle the response

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Server Error:", error.response.data);
      throw new Error(`Upload failed: ${error.response.data.message}`);
    } else if (error.request) {
      console.error("No Response:", error.request);
      throw new Error("No response from server. Please try again later.");
    } else {
      console.error("Error:", error.message);
      throw new Error(`An error occurred: ${error.message}`);
    }
  }
};
