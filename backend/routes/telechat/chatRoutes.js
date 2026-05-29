import { checkChatRoomsController } from "../../controllers/telechat/chatRoomController.js";
import { favouriteChatController } from "../../controllers/telechat/favouriteChatController.js";
import { updateFavouriteChat } from "../../controllers/telechat/updateFavouriteChat.js";
import { authenticateToken } from "../../middleware/userAuthentication.js";
import express from "express";

const favouriteRouter = express.Router();

export default (supabase) => {
  favouriteRouter.post("/checkrooms", authenticateToken, (req, res) =>
    checkChatRoomsController(req, res, supabase),
  );
  favouriteRouter.get("/favourite", authenticateToken, (req, res) =>
    favouriteChatController(req, res, supabase),
  );
  favouriteRouter.put("/updatefavouritechat", authenticateToken, (req, res) =>
    updateFavouriteChat(req, res, supabase),
  );

  return favouriteRouter;
};
