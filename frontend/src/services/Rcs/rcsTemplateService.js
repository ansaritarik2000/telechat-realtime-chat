import { axiosServerInstance } from "../../utils/axios/config";

// create text template
export const createTextTemplateService = async (token, templateData) => {
    try {
        const response = await axiosServerInstance.post(
            `/rcs/create-text-template`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating text template:", error);
        throw error;
    }
};

// create rich card template
export const createRichCardTemplateService = async (token, templateData) => {
    try {
        const response = await axiosServerInstance.post(
            `/rcs/create-rich-card-template`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating rich card template:", error);
        throw error;
    }
};

// create carousel template
export const createCarouselTemplateService = async (token, templateData) => {
    try {
        const response = await axiosServerInstance.post(
            `/rcs/create-carousel-template`,
            templateData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating carousel template:", error);
        throw error;
    }
};

// get template types
export const getTemplateTypes = async () => {
    const response = await axiosServerInstance.get(`/rcs/template_types`);
    return response.data;
};

// get templates based on bot_id and template_type_id
export const getTemplates = async (bot_id, template_type_id) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/templates/${bot_id}/${template_type_id}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching templates:", error);
        throw error;
    }
};

// get templates based on template id
export const getTemplateWithDetails = async (template_id) => {
    const response = await axiosServerInstance.get(
        `/rcs/template/${template_id}`
    );
    return response.data;
};

//***** currently below line services are not used*****//

// Get all templates
export const getAllTemplates = async () => {
    try {
        const response = await axiosServerInstance.get(`/rcs/templates`);
        return response.data;
    } catch (error) {
        console.error("Error fetching templates:", error);
        throw error;
    }
};

// Get template names by template ID
export const getTemplateNamesByTemplateId = async (templateId) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/templatenames/${templateId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching template names for template ID ${templateId}:`,
            error
        );
        throw error;
    }
};

// Get template names by template name ID
export const getTemplateNamesById = async (id) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/templatenamesbyid/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching template names for template ID ${templateId}:`,
            error
        );
        throw error;
    }
};

// Get headers by template name ID
export const getHeadersByTemplateNameId = async (templateNameId) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/templateheaders/${templateNameId}`
        );
        return response.data;
    } catch (error) {
        console.error(
            `Error fetching headers for template name ID ${templateNameId}:`,
            error
        );
        throw error;
    }
};

// Get header by header ID
export const getHeadersById = async (id) => {
    try {
        const response = await axiosServerInstance.get(
            `/rcs/templateheader/${id}`
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching headers for header ID ${id}:`, error);
        throw error;
    }
};

// Delete multiple templates based on template IDs
export const deleteTemplatesService = async (templateIds) => {
    try {
        const response = await axiosServerInstance.delete(
            `/rcs/delete-templates`,
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
