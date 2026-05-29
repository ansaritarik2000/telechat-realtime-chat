import jwt from "jsonwebtoken";

export const getActiveMembersController = async (req, res, supabase) => {
    try {
        const { id: creator_id } = req.user; // Extract creator ID from the request (authenticated user)
        const { id: logged_in_user_id } = req.user;

        // Fetch members from the member_user_details table with their associated user details
        const { data: members, error: fetchError } = await supabase
            .from("member_user_details")
            .select(
                `
                user_id,
                creator_id,
                avatar_value,
                avatar_type,
                status,
                users:user_id(
                    first_name,
                    last_name,
                    email,
                    token
                )
            `
            )
            .or(`creator_id.eq.${creator_id},status.not.in.(trash,inactive)`)
            .neq("user_id", logged_in_user_id);
        if (fetchError) {
            return res.status(500).json({
                status: "ERROR",
                message: "Failed to fetch members.",
                error: fetchError.message,
            });
        }

        // Filter active members by verifying their token
        const activeMembers = members.filter((member) => {
            const token = member?.users?.token;

            if (!token) return false; // Skip members without a token

            try {
                // Verify the token
                jwt.verify(token, process.env.JWT_SECRET);
                return true; // Token is valid
            } catch (err) {
                return false; // Invalid token
            }
        });

        // Format the active members data for the response
        const formattedActiveMembers = activeMembers.map((member) => ({
            avatar_type: member.avatar_type,
            avatar_value: member.avatar_value,
            user_id: member.user_id,
            first_name: member.users.first_name,
            last_name: member.users.last_name,
            full_name: `${member.users.first_name}${
                member.users.last_name ? " " : ""
            }${member.users.last_name}`,
            email: member.users.email,
        }));

        res.status(200).json({
            status: "SUCCESS",
            data: formattedActiveMembers,
            message: "Active members retrieved successfully.",
        });
    } catch (error) {
        console.error("Error retrieving active members:", error);
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while retrieving active members.",
        });
    }
};
