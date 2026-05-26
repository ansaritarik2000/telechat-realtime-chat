import express from "express";
import { createGroupController } from "../../controllers/telechat/groupController.js";
import { authenticateToken } from "../../middleware/userAuthentication.js";
import { getGroupsController } from "../../controllers/telechat/getGroupsController.js";
import { checkChatRoomsController } from "../../controllers/telechat/chatRoomController.js";
import { getGroupByIdController } from "../../controllers/telechat/getGroupByIdController.js";
import { getUserGroupsController } from "../../controllers/telechat/getUserGroupsController.js";
import { getGroupMembersController } from "../../controllers/telechat/getGroupMembersController.js";

const groupRouter = express.Router();

export default (supabase) => {
  // Create Group Route
  groupRouter.post("/create", authenticateToken, async (req, res) => {
    await createGroupController(req, res, supabase);
  });
  groupRouter.get("/list", authenticateToken, async (req, res) => {
    await getGroupsController(req, res, supabase);
  });
//   // 🆕 Get a single group by ID
//   groupRouter.get("/:groupId", authenticateToken, async (req, res) => {
//     await getGroupByIdController(req, res, supabase);
//   });
//     // 🆕 Get all groups for the user
//   groupRouter.get("/groups", authenticateToken, async (req, res) => {
//     await getAllGroupsForUserController(req, res, supabase); // Ensure this controller is used
//   });
  // Route to check existing chat rooms and create new ones if needed
  groupRouter.post("/check-rooms", authenticateToken, async (req, res) => {
    await checkChatRoomsController(req, res, supabase);
  });
   // 🆕 Route to get all groups where user is a member
   groupRouter.get("/groupuser", authenticateToken, async (req, res) => {
    await getUserGroupsController(req, res, supabase);
  });
  
   // ✅ NEW: Route to get group members
   groupRouter.get("/:groupId/members", authenticateToken, async (req, res) => {
    await getGroupMembersController(req, res, supabase);
  });
  

  return groupRouter;
};
