import { uid } from "uid";

// Function to save company details to sub_account_company_details table
export const saveCompanyDetails = async (
    user_id,
    business_name,
    pan_no,
    gst_no,
    dlt_entity_id,
    address,
    city,
    state,
    pin,
    country,
    url,
    supabase
) => {
    try {
        const organization_id = uid(6);
        // Insert company details into the table
        const { data: companyDetails, error } = await supabase
            .from("sub_account_company_details")
            .insert([
                {
                    organization_id,
                    user_id,
                    business_name,
                    pan_no,
                    gst_no,
                    dlt_entity_id,
                    address,
                    city,
                    state,
                    pin,
                    country,
                    url: url ? `https://${url}` : "", // add https in starting
                },
            ])
            .single();

        if (error) {
            console.log("Error saving company details:", error.message);
            throw new Error(error.message || "Failed to save company details.");
        }

        return companyDetails;
    } catch (err) {
        console.error("Error saving company details:", err.message);
        console.error("Error saving company details:", err.message);
        throw err;
    }
};
