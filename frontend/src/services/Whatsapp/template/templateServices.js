import axios from "axios";
import { backend_base_url } from "../../common";
import { axiosServerInstance } from "../../../utils/axios/config";

// this service function is used for get waba id's
export const getWabaIdsService = async ({ token }) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/wabaids`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: "Failed to get Waba id's",
            error: error,
        };
    }
};

// this service is used for get whatsapp template types

export const getTemplateTypesService = async ({ token }) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/template-types`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: "Failed to get Whatsapp template types",
            error: error,
        };
    }
};

// this service is used for get whatsapp templates based on template type id
export const getTemplatesService = async ({ token, templateTypeId }) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/templates`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    templateTypeId,
                },
            }
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        return {
            status: "ERROR",
            message: "Failed to get Whatsapp templates",
            error: error,
        };
    }
};

// this service is used for get whatsapp template by id

export const getWhatsappTemplateWithDetails = async ({
    token,
    template_id,
}) => {
    try {
        const response = await axiosServerInstance.get(
            `/whatsapp/campaign/template/${template_id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.data.status,
            data: response.data.data,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Error fetching template:", error);
        return {
            status: "ERROR",
            message: "Error fetching template",
            error: error,
        };
    }
};
