import { getCurrentMemberDetails } from "../../utils/members/getCurrentMemberDetails.js";

// Controller function to update the status of a member to "trash" based on user_id
export const trashMemberController = async (req, res, supabase) => {
    try {
        const { id } = req.user;
        const { user_id } = req.body; // Get user_id from request body

        console.log("user_id", user_id);
        //get user details
        const userDetails = await getCurrentMemberDetails(
            user_id,
            "creator_id",
            supabase
        );
        const { creator_id } = userDetails;

        // check requested user is creator or not if not then not permisssion to login
        if (creator_id !== id) {
            return res.status(403).send({
                status: "ERROR",
                message: `You don't have access to delete.`,
            });
        }

        if (!user_id) {
            return res.status(400).send({
                status: "ERROR",
                message: "User ID is required.",
            });
        }

        // Update the status of the record where user_id matches
        const { data, error } = await supabase
            .from("member_user_details")
            .update({ status: "trash" })
            .eq("user_id", user_id)
            .select("*");

        if (error) {
            return res.status(500).send({
                status: "ERROR",
                message: error.message || "Failed to update member status.",
            });
        }

        if (!data || data.length === 0) {
            return res.status(400).send({
                status: "ERROR",
                message: "Error when delete member.",
            });
        }

        res.status(200).send({
            status: "SUCCESS",
            data,
            message: "Member deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to delete member.",
        });
    }
};
