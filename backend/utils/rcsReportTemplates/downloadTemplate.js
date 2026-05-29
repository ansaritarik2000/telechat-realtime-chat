import {
    applyPagination,
    applySearchFilter,
    applyStatusFilter,
} from "../filterTemplates.js";

//  function to fetch RCS template reports
export const getRcsTemplateReports = async (
    supabase,
    page,
    limit,
    search,
    status
) => {
    let query = supabase.from("rcs_templates").select("*");

    // Apply reusable filters
    query = applySearchFilter(query, search, "name");
    query = applyStatusFilter(query, status, "status");
    query = applyPagination(query, page, limit);

    // Fetch data
    const { data, error } = await query;

    if (error) {
        throw new Error("Failed to fetch RCS template reports.");
    }

    return data;
};

// fetch rcs templates basis of template primary ids

export const getRcsTemplatesBasedonIds = async ({ supabase, ids }) => {
    const { data, error } = await supabase
        .from("rcs_templates")
        .select("template_json")
        .in("id", ids);

    if (error) {
        throw new Error("Failed to fetch RCS templates.");
    }
    return data;
};
