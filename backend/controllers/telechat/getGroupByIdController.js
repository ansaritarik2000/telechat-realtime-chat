export const getGroupByIdController = async (req, res, supabase) => {
    // console.log("➡️ groupId param:", req.params.groupId);
    // console.log("➡️ typeof groupId:", typeof req.params.groupId);

    const groupId = req.params.groupId;
    const userId = req.user?.id;

    if (!groupId) {
        return res.status(400).json({ status: "FAILED", message: "Invalid group ID" });
    }

    // Fetch the group details by group_id
    const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select("group_id, group_name, created_by, is_private")
        .eq("group_id", groupId)
        .single();

    if (groupError || !groupData) {
        return res.status(404).json({ status: "FAILED", message: "Group not found." });
    }

    // Check if the user is the creator or a member of the group
    const { data: memberData, error: memberError } = await supabase
        .from("group_members")
        .select("user_id, role, status")
        .eq("group_id", groupId)
        .eq("user_id", userId)
        .single();

    if (memberError || !memberData) {
        // If the user is not a member, return a "Forbidden" error
        return res.status(403).json({ status: "FAILED", message: "You are not a member of this group." });
    }

    // Fetch all members of the group
    const { data: allMembers, error: allMembersError } = await supabase
        .from("group_members")
        .select("user_id, role, status")
        .eq("group_id", groupId);

    if (allMembersError) {
        return res.status(500).json({ status: "FAILED", message: "Error fetching group members." });
    }

    return res.status(200).json({
        status: "SUCCESS",
        message: "Group details fetched successfully.",
        group: groupData,
        members: allMembers,
    });
};
