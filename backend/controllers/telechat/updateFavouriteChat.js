export const updateFavouriteChat = async (req, res, supabase) => {
    const { user_id, is_favourite } = req.body;

    // console.log(user_id,"la");
    

    // Validate input
    if (!user_id || typeof is_favourite !== "boolean") {
        return res.status(400).json({
            status: "FAILED",
            message: "Invalid input: user_id and is_favourite are required",
        });
    }

    console.log("Input values:", user_id, is_favourite);

    try {
        const { data: chatData, error } = await supabase
            .from("member_user_details")
            .update({ is_favourite })
            .match({ user_id });

        if (error) {
            console.error("Database error:", error);
            return res.status(400).json({
                status: "FAILED",
                message: "Something went wrong with the database operation",
            });
        }

        return res.status(200).json({
            status: "SUCCESS",
            data: chatData,
            message: "Chat favourite status updated successfully",
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "An unexpected error occurred",
        });
    }
};
