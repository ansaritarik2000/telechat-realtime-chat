import { applyPagination, applySearchFilter } from "../filterTemplates.js";

// get phonebook data
export const getPhoneBookData = async (supabase, page, limit, search, tags) => {
    let query = supabase
        .from("phonebook_contacts")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

    // Apply search filter if a search query is provided
    query = applySearchFilter(query, search, "contact_name");
    query = applyPagination(query, page, limit);

    // Apply tags filter if not "all"
    if (tags !== "all") {
        const tagsArray = Array.isArray(tags) ? tags : tags.split(","); // Convert tags string to array if needed
        query = query.contains("tags_only_string", tagsArray);
    }

    // Fetch data
    const { data, error } = await query;

    if (error) {
        throw new Error("Failed to fetch phonebook data.");
    }

    return data;
};
