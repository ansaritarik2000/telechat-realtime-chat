// function to get member details
export const getCurrentMemberDetails = async (user_id, columns, supabase) => {
    const { data, error } = await supabase
        .from("member_user_details")
        .select(columns)
        .eq("user_id", user_id)
        .single();

    if (error) {
        console.log("failed to fetch member", error);
        throw new Error("Failed to fetch members.");
    }

    return data;
};


