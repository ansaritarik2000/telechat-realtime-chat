// Function to get user details by ID from the users table
export const getUserDetailsById = async (id, supabase) => {
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            throw new Error("User not found.");
        }

        return user;
    } catch (err) {
        console.error("Error fetching user details:", err.message);
        throw err;
    }
};
