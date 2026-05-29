// Function to update RCS service pricing details
export const updateRcsServicePricing = async (
    user_id,
    {
        rcs_text_credits,
        rcs_text_credits_billing_on,
        rcs_multimedia_credits,
        rcs_multimedia_credits_billing_on,
    },
    supabase
) => {
    try {
        // Prepare the fields to update
        const updatedFields = {};
        if (rcs_text_credits) updatedFields.rcs_text_credits = rcs_text_credits;
        if (rcs_text_credits_billing_on)
            updatedFields.rcs_text_credits_billing_on =
                rcs_text_credits_billing_on;
        if (rcs_multimedia_credits)
            updatedFields.rcs_multimedia_credits = rcs_multimedia_credits;
        if (rcs_multimedia_credits_billing_on)
            updatedFields.rcs_multimedia_credits_billing_on =
                rcs_multimedia_credits_billing_on;

        // Update the RCS service pricing details in the table
        const { data, error } = await supabase
            .from("rcs_service_pricing")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            throw new Error(
                `Error updating RCS Service Pricing: ${error.message}`
            );
        }

        return data; // Return the updated data if needed
    } catch (error) {
        throw new Error(
            `Error in updateRcsServicePricing function: ${error.message}`
        );
    }
};
