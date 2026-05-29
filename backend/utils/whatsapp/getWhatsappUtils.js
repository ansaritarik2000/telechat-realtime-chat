// this function is extracting campaign data use of campaign_id

import { formatDate } from "../dateformat.js";

export const getWhatsappCampaigns = async (
    req,
    res,
    supabase,
    campaign_id,
    limit = 5,
    offset = 0,
    columns = "*",
    start_date,
    end_date,
    search,
    status
) => {
    // Convert offset and limit to numbers
    const limitNum = parseInt(limit, 10);
    const offsetNum = parseInt(offset, 10);

    try {
        let query = supabase
            .from("sendWhatsApp")
            .select(
                `
                ${columns},
                whatsapp_campaign:campaign_id(
                    campaign_name,
                    template_type:template_type_id(template_type_name)
                )
             `,

                { count: "exact" }
            )
            .order("id", { ascending: false })
            .range(offsetNum, offsetNum + limitNum - 1);

        if (campaign_id) {
            query = query.eq("campaign_id", campaign_id);
        }

        if (start_date && end_date) {
            query = query
                .gte("created_at", start_date)
                .lte("created_at", `${end_date}T23:59:59`);
        }

        if (status && status !== "all") {
            if (Array.isArray(status)) {
                query = query.in("status", status); // Filtering based on multiple statuses
            } else {
                query = query.eq("status", status); // Filtering based on a single status
            }
        }

        // Execute the query to get data from `sendWhatsApp` table
        const { data, error, count } = await query;

        if (error) {
            throw new Error(error.message);
        }

        // Filter data after the join, because Supabase doesn't allow filtering on joined tables
        let filteredData = data;

        if (search) {
            filteredData = data.filter((item) =>
                item.whatsapp_campaign?.campaign_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Map over each campaign and retrieve the total number of phone numbers from the `phone_numbers` array
        const formattedData = await Promise.all(
            filteredData.map(async (item) => {
                // Fetch phone numbers array from `whatsapp_phone_campaigns` for each `campaign_id`
                const { data: phoneData, error: phoneError } = await supabase
                    .from("whatsapp_phone_campaigns")
                    .select("phone_numbers")
                    .eq("campaign_id", item.campaign_id);

                if (phoneError) {
                    console.error(
                        "Error fetching phone numbers:",
                        phoneError.message
                    );
                    throw new Error("Failed to retrieve phone numbers.");
                }

                // Calculate the total number of phone numbers in the array
                const phoneNumbersCount = phoneData.reduce((total, entry) => {
                    return (
                        total +
                        (entry.phone_numbers ? entry.phone_numbers.length : 0)
                    );
                }, 0);

                return {
                    ...item,
                    submittedCredits: phoneNumbersCount, // Total count of phone numbers(correct and incorrect)
                    created_at: formatDate(new Date(item.created_at)),
                    campaign_name:
                        item?.whatsapp_campaign?.campaign_name || null,
                    type:
                        item?.whatsapp_campaign?.template_type
                            ?.template_type_name || null,
                    deliveredCredits: item?.phone_numbers
                        ? item?.phone_numbers?.length
                        : 0, // total count of correct phone_numbers
                };
            })
        );

        return { records: formattedData, totalRecords: count };
    } catch (error) {
        console.error("Error retrieving Whatsapp campaigns:", error.message);
        throw new Error(
            "Failed to retrieve WhataApp campaigns. Please try again later."
        );
    }
};

// this function get campaign for whatsapp send
export const getWhatsappCampaignData = async (campaign_id, supabase) => {
    try {
        // Query to get data from all related tables using the foreign key relationship
        const { data, error } = await supabase
            .from("sendWhatsApp")
            .select(
                `
                *,
                whatsapp_campaign:campaign_id(
                    *,
                    template_type:template_type_id(*),
                    template:template_id(*)
                )
             `
            )
            .eq("campaign_id", campaign_id);

        if (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }

        // Check if data is not empty
        if (data && data.length > 0) {
            // `data` will be an array of objects with the joined data
            return data[0];
        } else {
            throw new Error("No data found for the given campaign_id");
        }
    } catch (error) {
        console.error("Error retrieving data:", error.message);
        throw error;
    }
};

// this function get campaign for test whatsapp send
export const getTestWhatsappCampaignData = async (campaign_id, supabase) => {
    try {
        // Query to get data from all related tables using the foreign key relationship
        const { data, error } = await supabase
            .from("sendTestWhatsApp")
            .select(
                `
                *,
                whatsapp_campaign:campaign_id(
                    *,
                    template_type:template_type_id(*),
                    template:template_id(*)
                )
             `
            )
            .eq("campaign_id", campaign_id);

        if (error) {
            throw new Error(`Error fetching data: ${error.message}`);
        }

        // Check if data is not empty
        if (data && data.length > 0) {
            // `data` will be an array of objects with the joined data
            return data[0];
        } else {
            throw new Error("No data found for the given campaign_id");
        }
    } catch (error) {
        console.error("Error retrieving data:", error.message);
        throw error;
    }
};
