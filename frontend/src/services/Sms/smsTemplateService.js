import axios from "axios";
import { backend_base_url } from "../common";
import { axiosServerInstance } from "../../utils/axios/config";

// Get all template types service
export const getAllTemplateTypesSerivce = async () => {
    try {
        const response = await axiosServerInstance.get(`/sms/template-types`);
        return response.data;
    } catch (error) {
        console.error("Error fetching template types:", error);
        throw error;
    }
};

// Get templates service by template type id and aproved templates
export const getTemplateBasedOnTypeIdService = async (templateTypeId) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/templates/${templateTypeId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching templates for this ${templateTypeId}:`,
            error
        );
        throw error;
    }
};

// Get template service based on it's id
export const getTemplateBasedOnIdService = async (id) => {
    try {
        const response = await axiosServerInstance.get(`/sms/template/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching template names for id ${id}:`, error);
        throw error;
    }
};

// Get headers service by template id
export const getHeadersByTempidService = async (tempId) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/templateheaders/${tempId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching headers for template ID ${tempId}:`,
            error
        );
        throw error;
    }
};

// Get header service by it's id
export const getHeaderByIdService = async (id) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/templateheader/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching headers for header ID ${id}:`, error);
        throw error;
    }
};

// get template and header for report

export const getHeaderTemplateReportService = async (params) => {
    try {
        const response = await axiosServerInstance.get(
            `/sms/report-header-template`,
            {
                params: {
                    ...params,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching headers and templates`, error);
        throw error;
    }
};

// Service function to create a new approved template
export const createTemplateService = async (templateData) => {
    try {
        // Make the POST request to the backend with the provided template data
        const response = await axiosServerInstance.post(
            `/sms/add-template`,
            templateData
        );

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Error in creating template",
            error: error.response?.data || error,
        };
    }
};

// Delete multiple templates based on template IDs
export const deleteSmsTemplatesService = async (templateIds) => {
    try {
        const response = await axiosServerInstance.delete(
            `/sms/delete-templates`,
            {
                data: { templateIds }, // Pass the template IDs in the request body
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting templates:", error);
        throw error;
    }
};

// get header sevices
export const getHeaderService = async (params) => {
    try {
        const response = await axiosServerInstance.get(`/sms/get-headers`, {
            params: {
                ...params,
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching headers`, error);
        throw error;
    }
};

// Service function to create a new headers
export const createHeaderServices = async (headerData) => {
    try {
        // Make the POST request to the backend with the provided header data
        const response = await axiosServerInstance.post(
            `/sms/add-header`,
            headerData
        );

        // Return the response data on success
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        // Handle and return error response
        return {
            status: "ERROR",
            message:
                error.response?.data?.message || "Error in creating header",
            error: error.response?.data || error,
        };
    }
};

// Delete multiple headers based on header IDs
export const deleteSmsHeadersService = async (headerIds) => {
    try {
        const response = await axiosServerInstance.delete(
            `/sms/delete-headers`,
            {
                data: { headerIds }, // Pass the header IDs in the request body
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting headers:", error);
        throw error;
    }
};
