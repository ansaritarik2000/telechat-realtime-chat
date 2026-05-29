// save rcs service pricing
export const saveRcsServicePricing = async (
    rcs_text_credits,
    rcs_text_credits_billing_on,
    rcs_multimedia_credits,
    rcs_multimedia_credits_billing_on,
    user_id,
    supabase
) => {
    try {
        // Insert data into rcs_service_pricing table
        const { data, error } = await supabase
            .from("rcs_service_pricing")
            .insert([
                {
                    rcs_text_credits,
                    rcs_text_credits_billing_on,
                    rcs_multimedia_credits,
                    rcs_multimedia_credits_billing_on,
                    user_id,
                },
            ]);

        if (error) {
            throw new Error(
                `Error saving RCS Service Pricing: ${error.message}`
            );
        }

        return data; // Return the inserted data if needed
    } catch (error) {
        throw new Error(
            `Error in saveRcsServicePricing function: ${error.message}`
        );
    }
};
