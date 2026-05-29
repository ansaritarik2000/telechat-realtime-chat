// Function to update WhatsApp service pricing details
export const updateWhatsappServicePricing = async (
    user_id,
    {
        marketing_rate,
        marketing_rate_billing_on,
        utility_rate,
        utility_rate_billing_on,
        authentication_rate,
        authentication_rate_billing_on,
        service_rate,
        service_rate_billing_on,
    },
    supabase
) => {
    try {
        // Prepare the fields to update
        const updatedFields = {};
        if (marketing_rate) updatedFields.marketing_rate = marketing_rate;
        if (marketing_rate_billing_on)
            updatedFields.marketing_rate_billing_on = marketing_rate_billing_on;
        if (utility_rate) updatedFields.utility_rate = utility_rate;
        if (utility_rate_billing_on)
            updatedFields.utility_rate_billing_on = utility_rate_billing_on;
        if (authentication_rate)
            updatedFields.authentication_rate = authentication_rate;
        if (authentication_rate_billing_on)
            updatedFields.authentication_rate_billing_on =
                authentication_rate_billing_on;
        if (service_rate) updatedFields.service_rate = service_rate;
        if (service_rate_billing_on)
            updatedFields.service_rate_billing_on = service_rate_billing_on;

        // Update the WhatsApp service pricing details in the table
        const { data, error } = await supabase
            .from("whatsapp_service_pricing")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            throw new Error(
                "Failed to update WhatsApp service pricing: " + error.message
            );
        }

        return data; // Return the updated data if needed
    } catch (error) {
        throw new Error(
            "Error in updateWhatsappServicePricing function: " + error.message
        );
    }
};
