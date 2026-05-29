// This function is used for save template form

import { axiosServerInstance } from "../../utils/axios/config";

const saveTemplateFormService = async (templateJson) => {
    try {
        const response = await axiosServerInstance.post(
            `/sms/add-template-from`,
            {
                template_json: templateJson,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error saving template form:", error);
        throw error;
    }
};

export { saveTemplateFormService };
