// this utils function are save whatsapp inital data

import { formatDate } from "../dateformat.js";

// this function save whatsapp in details
export const saveWhatsappDetails = async (supabase, data) => {
    const {
        country,
        phone_number,
        submitted_at,
        campaign_id,
        // message_id,
        status = "pending", // default value for status
    } = data;

    try {
        const { data: insertData, error } = await supabase
            .from("whatsapp_details")
            .insert([
                {
                    country,
                    phone_number,
                    submitted_at,
                    campaign_id,
                    status: status,
                    // message_id,
                },
            ]);

        if (error) {
            throw new Error(`Error saving Whatspp details: ${error.message}`);
        }

        console.log("Whatsapp details saved successfully:", insertData);
        return insertData;
    } catch (error) {
        console.error("Error saving Whatsapp details:", error.message);
        throw error;
    }
};

// this function save test whatsapp in details
export const saveTestWhatsappDetails = async (supabase, data) => {
    const {
        country,
        phone_number,
        submitted_at,
        campaign_id,
        status = "pending", // default value for status
    } = data;

    try {
        const { data: insertData, error } = await supabase
            .from("whatsapp_test_details")
            .insert([
                {
                    country,
                    phone_number,
                    submitted_at,
                    campaign_id,
                    status: status,
                },
            ]);

        if (error) {
            throw new Error(`Error saving Whatsapp details: ${error.message}`);
        }

        console.log("Whatsapp details saved successfully:", insertData);
        return insertData;
    } catch (error) {
        console.error("Error saving Whatsapp details:", error.message);
        throw error;
    }
};

// this function are used for update whatsapp details like status, error, errorcode, delivered etc.
const updateWhatsappDetails = async (supabase, id, updateData) => {
    try {
        const { data: updatedData, error } = await supabase
            .from("whatsapp_details")
            .update(updateData)
            .eq("id", id);

        if (error) {
            throw new Error(
                `Error updating Whatsapp details: ${error.message}`
            );
        }

        console.log("Whatsapp details updated successfully:", updatedData);
        return updatedData;
    } catch (error) {
        console.error("Error updating Whatsapp details:", error.message);
        throw error;
    }
};

// Function to fetch whatsapp additional details from the database
export const fetchWhatsAppAdditionalDetails = async (supabase, campaign_id) => {
    const { data, error } = await supabase
        .from("whatsapp_details")
        .select(
            `*,
            whatsappcampaign:campaign_id(*,
                whatsapp_template_types:template_type_id(template_type_name)
            )`
        )
        .eq("campaign_id", campaign_id);

    if (error) {
        throw new Error(
            error.message || "Failed to fetch WhatsApp additional details."
        );
    }

    return data;
};

// Function to format the data
export const formatWhatsAppDetails = (data, whatsappSendResponse) => {
    return data.map((item) => ({
        ...item,
        date: formatDate(new Date(item.whatsappcampaign.created_at)),
        campaign_name: item.whatsappcampaign.campaign_name,
        type: item.whatsappcampaign.whatsapp_template_types.template_type_name, // Template type name
        waba_id: whatsappSendResponse.waba_id,
    }));
};
