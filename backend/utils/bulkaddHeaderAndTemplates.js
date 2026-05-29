import fs from "fs";

// Upload bulk template file  to Supabase
export const uploadTemplatesToSupabase = async (file, supabase, entity_id) => {
    const filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);

    try {
        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from("telepiefile")
            .upload(
                `uploads/smstemplates/${entity_id}/${file.filename}`,
                fileBuffer,
                {
                    contentType: file.mimetype,
                }
            );

        if (error) {
            console.error("Error uploading to Supabase:", error.message);
            throw new Error("Failed to upload file to Supabase");
        }

        // Clean up local file after upload
        await fs.promises.unlink(filePath);

        return { data, fileName: file.filename };
    } catch (err) {
        console.error("Error during file upload:", err.message);
        throw new Error("An error occurred while processing the file upload");
    }
};

// Function to insert upload data into the database sms_templates table
export const insertUploadTemplateData = async (
    supabase,
    entity_id,
    fileData
) => {
    try {
        for (const file of fileData) {
            // Step 1: Get or insert template_type_id from sms_template_types table

            const { data: templateTypeData, error: templateTypeError } =
                await supabase
                    .from("sms_template_types")
                    .select("id")
                    .eq("name", file["Template Type"])
                    .single();

            let template_type_id;

            if (templateTypeError) {
                throw new Error(
                    `Error fetching template type: ${templateTypeError.message}`
                );
            } else {
                template_type_id = templateTypeData
                    ? templateTypeData.id
                    : null;
            }

            // Step 2: Get or insert header_id from sms_headers table
            let header_id;
            const { data: headerData, error: headerFetchError } = await supabase
                .from("sms_headers")
                .select("id")
                .eq("name", file.Header)
                .single();

            if (headerFetchError) {
                // If header does not exist, insert it into the sms_headers table
                const { data: newHeaderData, error: headerInsertError } =
                    await supabase
                        .from("sms_headers")
                        .insert([{ name: file.Header }])
                        .select("id")
                        .single();

                if (headerInsertError) {
                    throw new Error(
                        `Error inserting new header: ${headerInsertError.message}`
                    );
                } else {
                    header_id = newHeaderData.id;
                }
            } else {
                header_id = headerData.id;
            }

            // Step 3: Insert data into sms_templates table
            const { data: templateData, error: templateError } = await supabase
                .from("sms_templates")
                .insert([
                    {
                        template_id: file["Template Id"],
                        name: file["Template Name"],
                        template_type_id: template_type_id,
                        header_id: header_id,
                        message: file.Message,

                        entity_id: entity_id,
                    },
                ]);

            if (templateError) {
                throw new Error(
                    `Error inserting template: ${templateError.message}`
                );
            }
        }

        return {
            status: "SUCCESS",
            message: "Templates inserted successfully",
        };
    } catch (error) {
        throw new Error(error.message || "Error when save templates");
    }
};

// Upload bulk header file  to Supabase
export const uploadHeaderToSupabase = async (file, supabase, entity_id) => {
    const filePath = file.path;
    const fileBuffer = fs.readFileSync(filePath);

    try {
        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
            .from("telepiefile")
            .upload(
                `uploads/smsheaders/${entity_id}/${file.filename}`,
                fileBuffer,
                {
                    contentType: file.mimetype,
                }
            );

        if (error) {
            console.error("Error uploading to Supabase:", error.message);
            throw new Error("Failed to upload file to Supabase");
        }

        // Clean up local file after upload
        await fs.promises.unlink(filePath);

        return { data, fileName: file.filename };
    } catch (err) {
        console.error("Error during file upload:", err.message);
        throw new Error("An error occurred while processing the file upload");
    }
};

// Function to insert upload data into the database sms_headers table
export const insertUploadHeaderData = async (supabase, fileData, entity_id) => {
    try {
        for (const file of fileData) {
            // Step 1: Get or insert template_type_id from sms_template_types table

            const { data: templateTypeData, error: templateTypeError } =
                await supabase
                    .from("sms_template_types")
                    .select("id")
                    .eq("name", file["Template Type"])
                    .single();

            let template_type_id;

            if (templateTypeError) {
                throw new Error(
                    `Error fetching template type: ${templateTypeError.message}`
                );
            } else {
                template_type_id = templateTypeData
                    ? templateTypeData.id
                    : null;
            }

            // Step 1: Directly insert the header into the sms_headers table
            const { data: newHeaderData, error: headerInsertError } =
                await supabase
                    .from("sms_headers")
                    .insert([
                        {
                            name: file["Header Id"],
                            dlt_id: file["Dlt Id"],
                            template_type_id,
                            entity_id: entity_id,
                            status: "approved",
                        },
                    ])
                    .select("id")
                    .single();

            if (headerInsertError) {
                throw new Error(
                    `Error inserting new header: ${headerInsertError.message}`
                );
            }
        }
        return {
            status: "SUCCESS",
            message: "Headers inserted successfully",
        };
    } catch (error) {
        throw new Error(error.message || "Error when saving headers");
    }
};
