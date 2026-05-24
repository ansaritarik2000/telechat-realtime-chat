export const getUserGroupsController = async (req, res, supabase) => {
  const userId = req.user?.id;
  console.log("User ID from token:", userId);

  if (!userId || isNaN(userId)) {
    return res.status(401).json({
      status: "FAILED",
      message: "Unauthorized or invalid user.",
    });
  }

  try {
    // Get all groups where the user is a member, along with their role
    const { data: groups, error } = await supabase
      .from("group_members")
      .select(`
        group_id,
        role,
        groups (
          group_id,
          group_name,
          created_at,
          is_private,
          created_by
        )
      `)
      .eq("user_id", userId);

    if (error) throw error;

    // Merge role into group object
    const userGroups = groups
      .filter(entry => entry.groups !== null)
      .map(entry => ({
        ...entry.groups,
        role: entry.role
      }));

    return res.status(200).json({
      status: "SUCCESS",
      groups: userGroups,
    });

  } catch (err) {
    console.error("Error fetching user groups:", err);
    return res.status(500).json({
      status: "FAILED",
      message: err.message || "Something went wrong.",
    });
  }
};
