// Function to update sub-account details in sub_account_user_details table
export const updateSubAccountDetails = async (
    user_id,
    {
        max_sub_acc,
        rel_mng_name,
        rel_mng_phone,
        rel_mng_country_dial_code,
        rel_mng_email,
        password,
        status,
        avatar_value,
        avatar_type,
    },
    supabase
) => {
    try {
        // Prepare the updated fields
        const updatedFields = {};
        if (max_sub_acc) updatedFields.max_sub_acc = max_sub_acc;
        if (rel_mng_name) updatedFields.rel_mng_name = rel_mng_name;
        if (rel_mng_phone) updatedFields.rel_mng_phone = rel_mng_phone;
        if (rel_mng_country_dial_code)
            updatedFields.rel_mng_country_dial_code = rel_mng_country_dial_code;
        if (rel_mng_email) updatedFields.rel_mng_email = rel_mng_email;
        if (password) updatedFields.password = password;
        if (avatar_value) updatedFields.avatar_value = avatar_value;
        if (avatar_type) updatedFields.avatar_type = avatar_type;
        if (status) updatedFields.status = status; // Ensure `status` can be updated even if it's `false`

        // Update the sub-account details in the table
        const { data: updatedDetails, error } = await supabase
            .from("sub_account_user_details")
            .update(updatedFields)
            .eq("user_id", user_id)
            .select("*")
            .single();

        if (error) {
            console.error("Failed to update sub-account details.", error);
            throw new Error("Failed to update sub-account details.");
        }

        return updatedDetails;
    } catch (err) {
        console.error("Error updating sub-account details:", err);
        throw err;
    }
};
