export const sendMessage = async (senderId, receiverId, message, supabase) => {
  try {
    const { data, error } = await supabase
      .from('telechat') 
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          message: message,
        },
      ]);
      console.log(senderId,receiverId,message);
      
    if (error) {
      console.error('Error inserting message:', error);
    } else {
      console.log('Message sent successfully:', data);
    }
  } catch (err) {
    console.error('Error:', err);
  }
};
