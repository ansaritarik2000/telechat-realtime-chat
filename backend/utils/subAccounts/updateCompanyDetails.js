// Function to update company details in sub_account_company_details table
export const updateCompanyDetails = async (
    user_id,
    {
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
    },
    supabase
) => {
    try {
        // Prepare the fields to update
        const updatedFields = {};
        if (business_name) updatedFields.business_name = business_name;
        if (pan_no) updatedFields.pan_no = pan_no;
        if (gst_no) updatedFields.gst_no = gst_no;
        if (dlt_entity_id) updatedFields.dlt_entity_id = dlt_entity_id;
        if (address) updatedFields.address = address;
        if (city) updatedFields.city = city;
        if (state) updatedFields.state = state;
        if (pin) updatedFields.pin = pin;
        if (country) updatedFields.country = country;
        if (url)
            updatedFields.url = url.startsWith("http") ? url : `https://${url}`;

        // Update the company details in the table
        const { data: updatedDetails, error } = await supabase
            .from("sub_account_company_details")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            throw new Error("Failed to update company details.");
        }

        return updatedDetails;
    } catch (err) {
        console.error("Error updating company details:", err.message);
        throw err;
    }
};
