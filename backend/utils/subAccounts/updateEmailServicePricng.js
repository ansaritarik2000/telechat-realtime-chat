// Function to update Email Service Pricing
export const updateEmailServicePricing = async (
    user_id,
    {
        promo_credits,
        promo_credits_billing_on,
        transactional_rates,
        transactional_rates_billing_on,
    },
    supabase
) => {
    try {
        // Prepare the fields to update
        const updatedFields = {};
        if (promo_credits) updatedFields.promo_credits = promo_credits;
        if (promo_credits_billing_on)
            updatedFields.promo_credits_billing_on = promo_credits_billing_on;
        if (transactional_rates)
            updatedFields.transactional_rates = transactional_rates;
        if (transactional_rates_billing_on)
            updatedFields.transactional_rates_billing_on =
                transactional_rates_billing_on;

        // Update the Email Service Pricing in the table
        const { data, error } = await supabase
            .from("email_service_pricing")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            throw new Error(
                "Failed to update email service pricing: " + error.message
            );
        }

        return data; // Return the updated data if needed
    } catch (error) {
        throw new Error(
            "Error in updateEmailServicePricing function: " + error.message
        );
    }
};
