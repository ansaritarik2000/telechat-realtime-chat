import express from "express";
import { getMessageController } from "../../controllers/telechat/messageController.js"; // Import the controller
import { authenticateToken } from "../../middleware/userAuthentication.js"; // Middleware for authentication

const messageRouter = express.Router();

const setupMessageRoutes = (supabase) => {
  // Route for getting messages
  messageRouter.post("/getmessages", authenticateToken, async (req, res) => {
    try {
      // Pass request, response, and supabase instance to the controller
      await getMessageController(req, res, supabase);
    } catch (error) {
      console.error("Error in getmessages route:", error.message); // Log detailed error message
      return res.status(500).json({
        status: "ERROR", // Consistent status naming
        message: "Internal server error",
      });
    }
  });

  return messageRouter; // Return the configured router
};

export default setupMessageRoutes;
