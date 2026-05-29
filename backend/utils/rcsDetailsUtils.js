// this utils function are save rcs inital data

import { formatDate } from "./dateformat.js";

// this function save rcs in details
export const saveRcsDetails = async (supabase, data) => {
    const {
        country,
        phone_number,
        submitted_at,
        campaign_id,
        message_id,
        device = "RCS",
        status = "pending", // default value for status
    } = data;

    try {
        const { data: insertData, error } = await supabase
            .from("rcs_details")
            .insert([
                {
                    country,
                    phone_number,
                    submitted_at,
                    campaign_id,
                    status: status,
                    message_id,
                    device,
                },
            ]);

        if (error) {
            throw new Error(`Error saving RCS details: ${error.message}`);
        }

        return insertData;
    } catch (error) {
        console.error("Error saving RCS details:", error.message);
    }
};

// this function save test rcs in details
export const saveTestRcsDetails = async (supabase, data) => {
    const {
        country,
        phone_number,
        submitted_at,
        campaign_id,
        message_id,
        status = "pending", // default value for status
    } = data;

    try {
        const { data: insertData, error } = await supabase
            .from("rcs_test_details")
            .insert([
                {
                    country,
                    phone_number,
                    submitted_at,
                    campaign_id,
                    status: status,
                    message_id,
                },
            ]);

        if (error) {
            throw new Error(`Error saving RCS details: ${error.message}`);
        }

        console.log("RCS details saved successfully:", insertData);
        return insertData;
    } catch (error) {
        console.error("Error saving RCS details:", error.message);
        throw error;
    }
};

// this function are used for update rcs details like status, error, errorcode, delivered etc.
const updateRcsDetails = async (supabase, id, updateData) => {
    try {
        const { data: updatedData, error } = await supabase
            .from("rcs_details")
            .update(updateData)
            .eq("id", id);

        if (error) {
            throw new Error(`Error updating RCS details: ${error.message}`);
        }

        console.log("RCS details updated successfully:", updatedData);
        return updatedData;
    } catch (error) {
        console.error("Error updating RCS details:", error.message);
        throw error;
    }
};

// Function to fetch RCS additional details from the database
export const fetchRcsAdditionalDetails = async (supabase, campaign_id) => {
    const { data, error } = await supabase
        .from("rcs_details")
        .select(
            `*,
            rcscampaign:campaign_id(*,
                rcs_template_types:template_type_id(name),
                rcs_bots:bot_id(bot_id)
            )`
        )
        .eq("campaign_id", campaign_id);

    if (error) {
        throw new Error(
            error.message || "Failed to fetch RCS additional details."
        );
    }

    return data;
};

// Function to format the data
export const formatRcsDetails = (data) => {
    return data.map((item) => ({
        ...item,
        bot_id: item.rcscampaign?.rcs_bots?.bot_id,
        date: formatDate(new Date(item.rcscampaign.created_at)),
        campaign_name: item.rcscampaign.campaign_name,
        campaign_type: item.rcscampaign.rcs_template_types.name, // Template type name
    }));
};
