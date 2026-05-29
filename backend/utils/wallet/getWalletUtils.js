// This function is used to get wallet details
export const getWalletDetails = async (supabase, user_id) => {
    try {
        const { data, error } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", user_id)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    } catch (error) {
        console.error("Error fetching wallet details:", error.message);
        throw new Error("Error fetching wallet details.");
    }
};
