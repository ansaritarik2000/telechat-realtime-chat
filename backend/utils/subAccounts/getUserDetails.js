// Helper function to get current sub-accounts count for a user
export const getCurrentSubAccountCount = async (creator_id, supabase) => {
    const { count, error } = await supabase
        .from("sub_account_user_details")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creator_id);

    if (error) throw new Error("Failed to fetch sub-accounts count");

    return count;
};

// function to get sub account details
export const getCurrentUserDetails = async (user_id, columns, supabase) => {
    const { data, error } = await supabase
        .from("sub_account_user_details")
        .select(columns)
        .eq("user_id", user_id)
        .single();
    console.log("error sub accounts", error);
    if (error) throw new Error("Failed to fetch sub-accounts.");

    return data;
};
