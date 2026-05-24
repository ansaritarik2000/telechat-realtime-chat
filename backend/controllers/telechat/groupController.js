const validateMembersExistence = async (uniqueMemberIds, supabase) => {
    const { data: validUsers, error: userError } = await supabase
      .from("users")
      .select("id")
      .in("id", uniqueMemberIds);
  
    if (userError) throw userError;
  
    const validUserIds = validUsers.map(user => user.id);
    return validUserIds;
  };
  
  export const createGroupController = async (req, res, supabase) => {
      console.log("Request Body:", req.body);
  
      const { groupName, members, isPrivate } = req.body;
      const createdById = req.user?.id;
      console.log("✅ Detected Creator ID (from token/middleware):", createdById);
  
      // Step 1: Basic validation
      if (!groupName || !Array.isArray(members) || members.length < 2) {
          return res.status(400).json({
              status: "FAILED",
              message: "Group must have a name and at least 2 members (excluding creator).",
          });
      }
  
      if (!createdById || isNaN(createdById)) {
          return res.status(401).json({
              status: "FAILED",
              message: "Invalid or unauthorized user.",
          });
      }
  
      // Step 2: Clean and convert member IDs to numbers, remove creator if mistakenly included
      const uniqueMemberIds = [...new Set(members.map(Number))].filter(
          id => !isNaN(id) && id !== createdById
      );
  
      if (uniqueMemberIds.length < 2) {
          return res.status(400).json({
              status: "FAILED",
              message: "At least 2 unique members (excluding creator) are required.",
          });
      }
  
      try {
          // Step 3: Verify members exist in `member_user_details` and are added by current user
          const validUserIds = await validateMembersExistence(uniqueMemberIds, supabase);
        
          if (uniqueMemberIds.some(id => !validUserIds.includes(id))) {
              return res.status(400).json({
                status: "FAILED",
                message: "One or more user IDs are invalid.",
              });
          }
  
          // Step 4: Create the group
          const { data: groupData, error: groupError } = await supabase
              .from("groups")
              .insert([
                  {
                      group_name: groupName,
                      created_by: createdById,
                      is_private: isPrivate || false,
                      created_at: new Date().toISOString(),
                  }
              ])
              .select();
  
          if (groupError) throw groupError;
  
          const groupId = groupData?.[0]?.group_id;
          if (!groupId) {
              return res.status(500).json({
                  status: "FAILED",
                  message: "Group creation failed.",
              });
          }
  
          // Step 5: Add members (creator as admin)
          const memberInserts = [
              {
                  group_id: groupId,
                  user_id: createdById,
                  role: 'admin',
                  status: 'active'
              },
              ...validUserIds.map(userId => ({
                  group_id: groupId,
                  user_id: userId,
                  role: 'member',
                  status: 'active'
              }))
          ];
  
          const { error: insertError } = await supabase
              .from("group_members")
              .insert(memberInserts);
  
          if (insertError) throw insertError;
  
          // ✅ Success
          return res.status(201).json({
              status: "SUCCESS",
              message: "Group created successfully!",
              group: groupData[0],
          });
  
      } catch (error) {
          console.error("Error in createGroupController:", error);
  
          return res.status(500).json({
              status: "FAILED",
              message: error.message || "Internal server error",
          });
      }
  };
  