export const checkChatRoomsController = async (req, res, supabase) => {
    try {
      const { userId, chatUserIds } = req.body;
  
      if (!userId || !Array.isArray(chatUserIds) || chatUserIds.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          message: "Invalid input: userId and chatUserIds are required",
        });
      }
  
      // Step 1: Validate Users Exist
      const { data: validUsers, error: userFetchError } = await supabase
        .from("users")
        .select("id")
        .in("id", [userId, ...chatUserIds]);
  
      if (userFetchError || !validUsers) {
        return res.status(400).json({
          status: "FAILED",
          message: "Error fetching users",
        });
      }
  
      const validUserIds = new Set(validUsers.map((user) => user.id));
      const validChatUsers = chatUserIds.filter((id) => validUserIds.has(id));
  
      if (validChatUsers.length === 0) {
        return res.status(400).json({
          status: "FAILED",
          message: "No valid users found to create chat rooms",
        });
      }
  
      // Step 2: Build dynamic OR conditions using and(...)
      const orConditions = validChatUsers
        .map(chatUserId => 
          `and(participant_1.eq.${userId},participant_2.eq.${chatUserId})`
        )
        .concat(
          validChatUsers.map(chatUserId => 
            `and(participant_1.eq.${chatUserId},participant_2.eq.${userId})`
          )
        )
        .join(',');
  
      // Step 3: Fetch Existing Chat Rooms
      const { data: existingRooms = [], error: fetchError } = await supabase
        .from("chat_room")
        .select("*")
        .or(orConditions);
  
      if (fetchError) {
        return res.status(400).json({
          status: "FAILED",
          message: "Error fetching chat rooms",
        });
      }
  
      // Step 4: Identify missing rooms (not already created)
      const existingPairs = new Set(
        existingRooms.map(room =>
          `${Math.min(room.participant_1, room.participant_2)}-${Math.max(room.participant_1, room.participant_2)}`
        )
      );
  
      const missingUsers = validChatUsers.filter(chatUserId =>
        !existingPairs.has(`${Math.min(userId, chatUserId)}-${Math.max(userId, chatUserId)}`)
      );
  
      let newRooms = [];
  
      // Step 5: Create missing chat rooms
      if (missingUsers.length > 0) {
        const { data: createdRooms, error: createError } = await supabase
          .from("chat_room")
          .insert(
            missingUsers.map(chatUserId => ({
              participant_1: userId,
              participant_2: chatUserId
            }))
          )
          .select("*");
  
        if (createError) {
          return res.status(400).json({
            status: "FAILED",
            message: "Error creating new chat rooms",
          });
        }
  
        newRooms = createdRooms;
      }
  
      // Step 6: Return combined result
      return res.status(200).json({
        status: "SUCCESS",
        chatRooms: [...existingRooms, ...newRooms],
        message: "Chat rooms retrieved successfully",
      });
  
    } catch (error) {
      return res.status(500).json({
        status: "FAILED",
        message: "Something went wrong",
      });
    }
  };
  