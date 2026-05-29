//  update member details
export const updateMemberDetails = async (
    { member_id, status, password, avatar_value, avatar_type },
    supabase
) => {
    const { error } = await supabase
        .from("member_user_details")
        .update({ status, password, avatar_value, avatar_type })
        .eq("id", member_id);

    if (error) {
        throw new Error("Failed to update member details.");
    }
};
