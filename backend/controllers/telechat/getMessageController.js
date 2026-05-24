export const getMessageController = async (req, res, supabase) => {
  const { receiver_id, sender_id } = req.body;

  if (!receiver_id || !sender_id) {
    return res.status(400).json({
      status: "FAILED",
      message: "receiver_id and sender_id are required",
    });
  }

  try {
    // Query telechat table with the corrected conditions
    const { data: chatData, error } = await supabase
      .from("telechat")
      .select(`
        receiver_id,
        sender_id,
        message,
        created_at
      `)
      .or(
        `and(receiver_id.eq.${receiver_id},sender_id.eq.${sender_id}),and(receiver_id.eq.${sender_id},sender_id.eq.${receiver_id})`
      ) // Fetch chats between sender and receiver
      .order("created_at", { ascending: true }); // Sort by created_at descending (most recent first)

    if (error) {
      console.error("Supabase query error:", error);
      return res.status(400).json({
        status: "FAILED",
        message: "Failed to retrieve chats",
      });
    }

    // Respond with the retrieved chat data
    return res.status(200).json({
      status: "SUCCESS",
      data: chatData,
      message: "Chats retrieved and sorted successfully",
    });
  } catch (error) {
    console.error("Controller error:", error);
    return res.status(500).json({
      status: "FAILED",
      message: "Internal server error",
    });
  }
};
