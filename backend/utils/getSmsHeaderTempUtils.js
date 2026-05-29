// utils/templateUtils.js
import { formatDate } from "./dateformat.js"; // Assuming you have a utility to format the date
import { applySearchFilter, applyStatusFilter } from "./filterTemplates.js";

// this function is used for get template with header
const getHeaderAndTemplates = async (
    supabase,
    limit = 5,
    offset = 0,
    start_date,
    end_date,
    search,
    status
) => {
    try {
        // Convert offset and limit to numbers
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);

        let query = supabase
            .from("sms_templates")
            .select(
                `
                *,
                sms_headers!sms_templates_header_id_fkey(name),
                sms_template_types!sms_templates_template_type_id_fkey(name)
            `,
                { count: "exact" }
            )
            .order("created_at", { ascending: false })
            .range(offsetNum, offsetNum + limitNum - 1);

        // Apply filters

        query = applySearchFilter(query, search, "name");
        query = applyStatusFilter(query, status, "status");

        // Apply date range filter on the template data
        if (start_date && end_date) {
            query = query
                .gte("created_at", start_date)
                .lte("created_at", `${end_date}T23:59:59`);
        }

        // Fetch data
        const { data, error, count } = await query;

        if (error) throw error;

        // formatted data
        const formattedData = data.map((item, index) => {
            return {
                id: item.id,
                template_name: item?.name,
                created_on: formatDate(new Date(item.created_at)),
                header: item.sms_headers?.name,
                entity_id: item.entity_id,
                template_id: item.template_id,
                template_type: item.sms_template_types?.name,
                status: item.status,
                message: item.message,
            };
        });

        return { records: formattedData, totalRecords: count };
    } catch (err) {
        console.log("error", err);
        throw new Error("Error in fetching headers and templates");
    }
};

// this function is used for get header

const getHeaders = async (supabase, limit = 5, offset = 0, search, status) => {
    try {
        // Convert offset and limit to numbers
        const limitNum = parseInt(limit, 10);
        const offsetNum = parseInt(offset, 10);

        let query = supabase
            .from("sms_headers")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offsetNum, offsetNum + limitNum - 1);

        // Apply search filter if provided
        query = applySearchFilter(query, search, "name");

        // Apply status filter if provided
        query = applyStatusFilter(query, status, "status");

        // Fetch data
        const { data, error, count } = await query;

        if (error) throw error;

        // Format the header data
        const formattedHeaders = data.map((item) => ({
            id: item.id,
            header_id: item.name, // header name
            entity_id: item.entity_id,
            entity_name: item.entity_name,
            dlt_id: item?.dlt_id,
            status: item.status,
            created_on: formatDate(new Date(item.created_at)),
        }));

        return { records: formattedHeaders, totalRecords: count };
    } catch (err) {
        console.error("Error in fetching headers:", err);
        throw new Error("Error in fetching headers");
    }
};

export { getHeaderAndTemplates, getHeaders };
