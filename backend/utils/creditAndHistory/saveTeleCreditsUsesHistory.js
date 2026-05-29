// This function saves the TeleCredits uses history to the database.
const saveTeleCreditsUsesHistory = async ({ data, supabase }) => {
    try {
        // Save the TeleCredits uses history to the database
        const { data: teleCreditsUsesData, error } = await supabase
            .from("tele_credits_uses")
            .insert(data)
            .select("*");
        if (error) {
            throw new Error(error.message);
        }

        return teleCreditsUsesData;
    } catch (error) {
        console.error("Error saving TeleCredits uses history:", error);
        throw error;
    }
};

export { saveTeleCreditsUsesHistory };
