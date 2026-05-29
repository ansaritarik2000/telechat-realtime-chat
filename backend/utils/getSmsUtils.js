import { formatDate } from "./dateformat.js";

const getSmsCampaigns = async (
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
    const limitNum = parseInt(limit, 10); // Convert limit to a number
    const offsetNum = parseInt(offset, 10); // Convert offset to a number

    try {
        let query = supabase
            .from("smscampaign")
            .select(
                `
id,status,campaign_name,all_phone_numbers,created_at,valid_phone_numbers,route,template_type:sms_template_types(name),
                    header:sms_headers(name),
                    template:sms_templates(name)
                `,
                { count: "exact" }
            )
            .order("id", { ascending: false });

        if (campaign_id) {
            query = query.eq("id", campaign_id);
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

        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        // Filter data after the join, because Supabase doesn't allow filtering on joined tables
        let filteredData = data;

        if (search) {
            filteredData = data.filter((item) =>
                item?.campaign_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Get total filtered records count
        const totalRecords = filteredData?.length;

        // Apply pagination
        filteredData = filteredData.slice(offsetNum, offsetNum + limitNum);

        // Map over each campaign and retrieve the total number of phone numbers from the `phone_numbers` array

        const formattedData = await Promise.all(
            filteredData.map(async (item) => {
                return {
                    ...item,
                    submittedCredits: item?.all_phone_numbers?.length || 0, // Total count of phone numbers(correct and incorrect)
                    date: formatDate(new Date(item.created_at)), // created date
                    campaign_name: item?.campaign_name || null,
                    route: item?.route || null,
                    type: item?.template_type?.name || null, // template type
                    header_name: item?.header?.name || null,
                    template: item?.template?.name || null,
                    deliveredCredits: item?.valid_phone_numbers
                        ? item?.valid_phone_numbers?.length
                        : 0, // total count of correct phone_numbers
                };
            })
        );

        return { records: formattedData, totalRecords: totalRecords }; // Return only the count of filtered records
    } catch (error) {
        console.log("error", error);
        // Log the error or handle it appropriately
        console.error("Error retrieving SMS campaigns:", error.message);

        // Optionally, you can throw the error to be handled by the calling function
        throw new Error(
            "Failed to retrieve SMS campaigns. Please try again later."
        );
    }
};

// this function is extracting campaign data use of campaign_id
const getSmsCampaignData = async (campaign_id, supabase) => {
    try {
        // Query to get data from both tables using the foreign key relationship
        const { data, error } = await supabase
            .from("smscampaign")
            .select(
                `
                *
            `
            )
            .eq("id", campaign_id);
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
export { getSmsCampaigns, getSmsCampaignData };
