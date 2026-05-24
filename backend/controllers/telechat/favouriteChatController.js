// This controller is used to mark/unmark a chat as favourite
export const favouriteChatController = async (req, res, supabase) => {
    // const { user_id, is_favourite } = req.body;
    try {
        const { data: chatData, error } = await supabase
            .from("member_user_details")
            .select(
            `
                user_id,is_favourite,
                status, 
                avatar_type
            `
            )
            .eq("is_favourite", true);
        if (error) {
            console.log(error);
            return res.status(400).json({
                status: "FAILED",
                message: "Something went wrong",
            });
        }
        return res.status(200).json({
            status: "SUCCESS",
            data: chatData,
            message: "Chat retrieved status updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "FAILED",
            message: "Something went wrong",
        });
    }
};
