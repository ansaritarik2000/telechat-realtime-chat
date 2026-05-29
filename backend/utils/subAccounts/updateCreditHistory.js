// Function to update user credit history
export const updateCreditHistory = async (
    user_id,
    { auto_add_credits },
    supabase
) => {
    try {
        // Prepare the fields to update
        const updatedFields = {};
        updatedFields.auto_add_credits = auto_add_credits;

        // Update the user credit history in the table
        const { data, error } = await supabase
            .from("user_credit_history")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            throw new Error(
                "Failed to update credit history: " + error.message
            );
        }

        return data; // Return the updated data if needed
    } catch (error) {
        throw new Error(
            "Error in updateCreditHistory function: " + error.message
        );
    }
};
