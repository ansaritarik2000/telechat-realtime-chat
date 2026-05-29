// utils/creditHistoryUtils.js
const getAllCreditHistory = async (
    req,
    res,
    supabase,
    user_id,
    limit = 5,
    offset = 0,
    columns = "*",
    start_date,
    end_date,
    search,
    status
) => {
    try {
        // Convert offset and limit to numbers
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);

        // Fetch data from the credit_history table with pagination
        let query = supabase
            .from("sms_credit_history")
            .select(
                `*,smscampaign:campaign_id(*,
                    sms_templates(name,template_type_id,sms_template_types(name)) )`
            ) // Select columns (defaults to "*")
            .eq("user_id", user_id)
            .order("id", { ascending: false }); // Apply pagination using range

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

        // execute the query
        const { data, error } = await query;

        if (error) {
            throw new Error(error.message);
        }

        let filteredData = data;

        // here iam search on use of filter method because supabase doesn't support search on joined table
        if (search) {
            filteredData = data.filter((item) =>
                item.smscampaign?.campaign_name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        }
        // Get total filtered records count
        const totalRecords = filteredData.length;
        // Apply pagination
        filteredData = filteredData.slice(offsetNum, offsetNum + limitNum);

        // Return the fetched records
        return { records: filteredData, totalRecords: totalRecords };
    } catch (error) {
        console.error("Error fetching credit history:", error.message); // Log error for debugging
        throw new Error("Error fetching credit history: " + error.message);
    }
};

export { getAllCreditHistory };
