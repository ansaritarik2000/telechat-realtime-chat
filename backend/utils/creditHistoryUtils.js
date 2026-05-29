// Utility function to add credit history data to the database
const addCreditHistory = async (supabase, creditHistoryData) => {
    const { data, error } = await supabase
        .from("sms_credit_history")
        .insert([creditHistoryData]);

    if (error) {
        throw error;
    }

    return data;
};

export { addCreditHistory };
