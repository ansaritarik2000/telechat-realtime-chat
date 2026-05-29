// get company details by user id
export const getCompanyDetailsByUserId = async (user_id, supabase) => {
    const { data, error } = await supabase
        .from("sub_account_company_details")
        .select(
            "business_name,pan_no,gst_no,dlt_entity_id,address,city,state,pin,country,url"
        )
        .eq("user_id", user_id)
        .single();

    if (error) throw new Error("Failed to fetch company details.");

    return data;
};
