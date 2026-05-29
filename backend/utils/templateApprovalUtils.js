// utils/templateApprovalUtils.js
const saveTemplateApproval = async (supabase, templateData) => {
    const {
        template_type,
        template_name,
        header,
        unicode,
        message,
    } = templateData;

    try {
        const { data, error } = await supabase
            .from("template_approval") // Use the 'template_approval' table
            .insert([
                {
                    template_name,
                    header,
                    unicode,
                    message,
                    template_type,
                },
            ]);

        if (error) throw error;

        return data;
    } catch (error) {
        console.error("Error in saveTemplateApproval:", error);
        throw error;
    }
};

export { saveTemplateApproval };
