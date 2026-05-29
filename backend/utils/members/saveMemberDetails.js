// save member details in details
export const saveMemberDetails = async (memberData, supabase) => {
    const {
        id,
        user_id,
        creator_id,
        status,
        avatar_value,
        avatar_type,
        password,
    } = memberData;

    const { error } = await supabase.from("member_user_details").insert([
        {
            id,
            user_id,
            creator_id,
            status,
            password,
            avatar_value,
            avatar_type,
        },
    ]);

    if (error) {
        throw new Error("Failed to save member details: " + error.message);
    }
};
