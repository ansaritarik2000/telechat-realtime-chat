// Function to save sub-account details to sub_account_user_details table
export const saveSubAccountDetails = async (
    user_id,
    max_sub_acc,
    rel_mng_name,
    rel_mng_phone,
    rel_mng_country_dial_code,
    rel_mng_email,
    creator_id,
    password,
    avatar_value,
    avatar_type,
    supabase
) => {
    try {
        // Insert sub-account details into the table
        const { data: subAccountDetails, error } = await supabase
            .from("sub_account_user_details")
            .insert([
                {
                    user_id,
                    max_sub_acc,
                    rel_mng_name,
                    rel_mng_phone,
                    rel_mng_country_dial_code,
                    rel_mng_email,
                    creator_id,
                    password,
                    avatar_value,
                    avatar_type,
                },
            ])
            .single();

        if (error) {
            console.log("Failed to save sub-account details.", error);
            throw new Error("Failed to save sub-account details.");
        }

        return subAccountDetails;
    } catch (err) {
        console.error("Error saving sub-account details:", err);
        throw err;
    }
};
