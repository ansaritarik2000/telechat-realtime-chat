// testCampaignUtils.js
export const fetchTemplateMessage = async (supabase, template_id) => {
    try {
        const { data, error } = await supabase
            .from("sms_template_names")
            .select("message")
            .eq("id", template_id)
            .single(); // Expecting a single result

        if (error) {
            console.error("Error fetching template message:", error);
            return null;
        }

        // Log the data to check if message exists
        console.log("Fetched data:", data);

        // Return the message or null if no data is found
        return data && data.message ? data.message : null;
    } catch (err) {
        console.error("Error in fetchTemplateMessage function:", err);
        return null;
    }
};

