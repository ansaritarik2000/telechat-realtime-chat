// save credits user auto credits or not
export const saveCreditAndhistory = async (
    auto_add_credits,
    user_id,
    supabase
) => {
    try {
        const { data, error } = await supabase
            .from("user_credit_history")
            .insert([{ user_id, auto_add_credits }]);

        if (error) throw error;

        return data;
    } catch (error) {
        throw new Error("Failed to save credit history: " + error.message);
    }
};
