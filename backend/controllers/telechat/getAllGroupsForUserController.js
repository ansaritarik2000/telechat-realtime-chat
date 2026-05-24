export const getAllGroupsForUserController = async (req, res, supabase) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({ status: "FAILED", message: "User not authenticated" });
    }

    // Fetch groups where the user is either a member or an admin
    const { data: groups, error: groupsError } = await supabase
        .from("group_members")
        .select("group_id, groups.group_name, groups.is_private")
        .eq("user_id", userId)
        .innerJoin("groups", "group_members.group_id", "groups.group_id");

    if (groupsError) {
        return res.status(500).json({ status: "FAILED", message: "Error fetching groups." });
    }

    // If no groups found
    if (!groups || groups.length === 0) {
        return res.status(404).json({ status: "FAILED", message: "No groups found for this user." });
    }

    return res.status(200).json({
        status: "SUCCESS",
        message: "User's groups fetched successfully.",
        groups,
    });
};
