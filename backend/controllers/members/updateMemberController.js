import { updateUser } from "../../utils/subAccounts/updateUser.js";
import { updateMemberDetails } from "../../utils/members/updateMembeDetails.js";
import { getCurrentMemberDetails } from "../../utils/members/getCurrentMemberDetails.js";

export const updateMemberController = async (req, res, supabase) => {
    try {
        const { id } = req.user; // Creator ID from authenticated user
        const {
            member_id,
            user_id,
            email,
            first_name,
            last_name,
            phone_no,
            country_dial_code,
            status,
            role,
            password,
            avatar_value,
            avatar_type,
        } = req.body;

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
                message: `You don't have access to purge.`,
            });
        }

        if (!user_id) {
            return res.status(400).send({
                status: "ERROR",
                message: "User ID is required.",
            });
        }

        // Check if the member exists
        const { data: member, error: fetchError } = await supabase
            .from("member_user_details")
            .select("user_id")
            .eq("id", member_id)
            .single();

        if (fetchError || !member) {
            return res.status(404).send({
                status: "ERROR",
                message: "Member not found.",
            });
        }

        // Update the user's details in the users table
        await updateUser(
            user_id,
            {
                email,
                first_name,
                last_name,
                phone_no,
                country_dial_code,
                role,
                password,
            },
            supabase
        );

        // Update member-specific details in the member table
        await updateMemberDetails(
            { member_id, status, password, avatar_value, avatar_type },
            supabase
        );

        res.status(200).send({
            status: "SUCCESS",
            message: "Member updated successfully",
        });
    } catch (error) {
        console.log("Failed to update member", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to update member.",
        });
    }
};
