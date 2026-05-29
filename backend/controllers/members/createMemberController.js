import { uid } from "uid";
import { createUser } from "../../utils/subAccounts/createUser.js";
import { saveMemberDetails } from "../../utils/members/saveMemberDetails.js";
import { getUserDetailsById } from "../../utils/subAccounts/getUser.js";

//  this route handller function is used for create member
export const createMemberController = async (req, res, supabase) => {
    try {
        console.log("In Member controller");
        const { id: creator_id } = req.user; // Creator ID from authenticated user
        const {
            email,
            password,
            first_name,
            last_name,
            phone_no,
            status,
            role,
            avatar_value,
            avatar_type,
            country_dial_code,
        } = req.body;

        // Fetch user details using the helper function
        const user = await getUserDetailsById(creator_id, supabase);

        if (user.role !== "admin" && user.role !== "superadmin") {
            return res.status(403).send({
                status: "ERROR",
                message: "You don't have access to create a member.",
            });
        }

        // Create a new user in the users table
        const newUser = await createUser(
            email,
            password,
            first_name,
            last_name,
            phone_no,
            country_dial_code,
            role,
            supabase
        );

        const user_id = newUser.id; // User ID of the newly created user

        const member_id = uid(5).toUpperCase(); // Generate a 5-character unique ID

        // Save member details in the member table
        await saveMemberDetails(
            {
                id: member_id,
                user_id,
                creator_id,
                status,
                password,
                avatar_value,
                avatar_type,
            },
            supabase
        );

        res.status(201).send({
            status: "SUCCESS",
            data: { member_id, user_id },
            message: "Member created successfully",
        });
    } catch (error) {
        console.log("Failed to create member", error);
        res.status(500).send({
            status: "ERROR",
            message: error.message || "Failed to create member.",
        });
    }
};
