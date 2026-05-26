import express from 'express';
import { sendMessage } from "../../controllers/telechat/messageController.js"; // Import the sendMessage controller
import { authenticateToken } from "../../middleware/userAuthentication.js";
import { getMessageController } from '../../controllers/telechat/getMessageController.js';

const telechatRouter = express.Router();

export default (supabase) => {
  // Route for sending a message
  telechatRouter.post("/sendmessage", authenticateToken, async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    console.log(sender_id);
    
    if (!sender_id || !receiver_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await sendMessage(sender_id, receiver_id, message, supabase); // Pass supabase if required in your function
      return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      return res.status(500).json({ error: "Failed to send message" });
    }
  });


  // Route for getting messages
  telechatRouter.post("/getmessages", authenticateToken, async (req, res) => {
      try {
        // Pass request, response, and supabase instance to the controller
        await getMessageController(req, res, supabase);
      } catch (error) {
        console.error("Error in getmessages route:", error);
        return res.status(500).json({
          status: "FAILED",
          message: "Internal server error",
        });
      }
    });


  return telechatRouter;
};
