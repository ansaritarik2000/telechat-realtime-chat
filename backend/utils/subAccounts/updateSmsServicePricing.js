// Function to update SMS service pricing details
export const updateSmsServicePricing = async (
    user_id,
    {
        promo_credits,
        promo_credits_billing_on,
        transactional_rates,
        transactional_rates_billing_on,
        otp_credits,
        otp_credits_billing_on,
        global_credits,
        global_credits_billing_on,
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
        if (otp_credits) updatedFields.otp_credits = otp_credits;
        if (otp_credits_billing_on)
            updatedFields.otp_credits_billing_on = otp_credits_billing_on;
        if (global_credits) updatedFields.global_credits = global_credits;
        if (global_credits_billing_on)
            updatedFields.global_credits_billing_on = global_credits_billing_on;

        // Update the SMS service pricing details in the table
        const { data, error } = await supabase
            .from("sms_service_pricing")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            console.log("error", error);
            throw new Error("Failed to update SMS service pricing details.");
        }

        return data;
    } catch (err) {
        console.log("error", err);
        console.error(
            "Error updating SMS service pricing details:",
            err.message
        );
        throw err;
    }
};
