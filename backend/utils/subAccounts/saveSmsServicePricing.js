// Function to save SMS service pricing details
export const saveSmsServicePricing = async (
    promo_credits,
    promo_credits_billing_on,
    transactional_rates,
    transactional_rates_billing_on,
    otp_credits,
    otp_credits_billing_on,
    global_credits,
    global_credits_billing_on,
    user_id,
    supabase
) => {
    try {
        const { data, error } = await supabase
            .from("sms_service_pricing")
            .insert([
                {
                    promo_credits,
                    promo_credits_billing_on,
                    transactional_rates,
                    transactional_rates_billing_on,
                    otp_credits,
                    otp_credits_billing_on,
                    global_credits,
                    global_credits_billing_on,
                    user_id,
                },
            ])
            .single();

        if (error) {
            console.log("error", error);
            throw new Error("Failed to save SMS service pricing details.");
        }

        return data;
    } catch (err) {
        console.log("error", err);
        console.error("Error saving SMS service pricing details:", err.message);
        throw err;
    }
};
