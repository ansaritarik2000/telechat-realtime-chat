// save whatsapp pricing
export const saveWhatsappServicePricing = async (
    marketing_rate,
    marketing_rate_billing_on,
    utility_rate,
    utility_rate_billing_on,
    authentication_rate,
    authentication_rate_billing_on,
    service_rate,
    service_rate_billing_on,
    user_id,
    supabase
) => {
    try {
        const { data, error } = await supabase
            .from("whatsapp_service_pricing")
            .insert([
                {
                    marketing_rate,
                    marketing_rate_billing_on,
                    utility_rate,
                    utility_rate_billing_on,
                    authentication_rate,
                    authentication_rate_billing_on,
                    service_rate,
                    service_rate_billing_on,
                    user_id,
                },
            ]);

        if (error) throw error;

        return data;
    } catch (error) {
        throw new Error(
            "Failed to save WhatsApp service pricing: " + error.message
        );
    }
};
