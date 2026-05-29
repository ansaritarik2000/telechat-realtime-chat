// save Email Service Pricing
export const saveEmailServicePricing = async (
    promo_credits,
    promo_credits_billing_on,
    transactional_rates,
    transactional_rates_billing_on,
    user_id,
    supabase
) => {
    try {
        const { data, error } = await supabase
            .from("email_service_pricing")
            .insert([
                {
                    promo_credits,
                    promo_credits_billing_on,
                    transactional_rates,
                    transactional_rates_billing_on,
                    user_id,
                },
            ]);

        if (error) throw error;

        return data;
    } catch (error) {
        throw new Error(
            "Failed to save email service pricing: " + error.message
        );
    }
};
