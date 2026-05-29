// this function is used for add templates in sms_templates table
const addTemplate = async (supabase, templateData) => {
    const {
        template_name,
        template_id,
        template_type_id,
        entity_id,
        sender_id,
        content,
    } = templateData;

    const { data, error } = await supabase.from("sms_templates").insert([
        {
            name: template_name,
            template_id,
            entity_id,
            template_type_id,
            status: "pending", // default status pending
            header_id: sender_id,
            message: content,
        },
    ]);

    if (error) throw error;

    return data;
};

// this function is used for add headers in sms_headers table
const addHeader = async (supabase, headerData) => {
    const { name, entity_name, template_type_id, entity_id, dlt_id, status } =
        headerData;

    const { data, error } = await supabase.from("sms_headers").insert([
        {
            name,
            entity_name,
            entity_id,
            dlt_id,
            template_type_id,
            status: "pending",
        },
    ]);

    if (error) throw error;

    return data;
};

export { addTemplate, addHeader };
