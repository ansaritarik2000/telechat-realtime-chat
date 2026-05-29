// this services is used to upload the file to s3 bucket
import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";
export const uploadFileToServer = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file); // Key name should match `upload.single("file")` in the backend

        const response = await axiosServerInstance.post(
            `/s3/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        if (response.status === "SUCCESS") {
            return {
                status: "SUCCESS",
                message: "File uploaded successfully",
                data: response.data.data,
            };
        }

        return response.data; // Contains the message and S3 response from the backend
    } catch (error) {
        return {
            status: "ERROR",
            message: "File upload failed",
            error: error.message,
        };
    }
};
