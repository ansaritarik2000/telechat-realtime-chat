export const getGroupMembersController = async (req, res, supabase) => {
    const groupId = req.params.groupId;
  
    if (!groupId) {
      return res.status(400).json({
        status: "FAILED",
        message: "Group ID is required.",
      });
    }
  
    try {
      // Step 1: Get group_members with user info (correct field names)
      const { data: members, error: groupError } = await supabase
        .from("group_members")
        .select(`
          user_id,
          role,
          users!group_members_user_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq("group_id", groupId)
        .eq("status", "active");
  
      if (groupError) throw groupError;
  
      // Step 2: Get member_user_details separately
      const userIds = members.map((m) => m.user_id);
      const { data: avatars, error: avatarError } = await supabase
        .from("member_user_details")
        .select("user_id, avatar_type, avatar_value")
        .in("user_id", userIds);
  
      if (avatarError) throw avatarError;
  
      // Step 3: Merge details
      const formattedMembers = members.map((member) => {
        const avatar = avatars.find((a) => a.user_id === member.user_id);
        const fullName = `${member.users?.first_name || ""} ${member.users?.last_name || ""}`.trim();
  
        return {
          user_id: member.user_id,
          name: fullName,
          avatarType: avatar?.avatar_type || "character",
          avtarValue: avatar?.avatar_value || "",
          role: member.role || "member",
        };
      });
  
      return res.status(200).json({
        status: "SUCCESS",
        members: formattedMembers,
      });
    } catch (err) {
      console.error("Error fetching group members:", err);
      return res.status(500).json({
        status: "FAILED",
        message: err.message || "Something went wrong.",
      });
    }
  };
  