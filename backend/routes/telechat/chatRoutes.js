import { favouriteChatController } from "../../controllers/telechat/favouriteChatController.js";
import { updateFavouriteChat } from "../../controllers/telechat/updateFavouriteChat.js";
import { authenticateToken } from "../../middleware/userAuthentication.js";
import express from "express";

const favouriteRouter = express.Router();

export default (supabase) => {
  // this routes is used for get favourite chats
  favouriteRouter.get("/favourite", authenticateToken, (req, res) =>
    favouriteChatController(req, res, supabase)
  );
  // this routes is used for favourite/unfavourite chat
  favouriteRouter.put("/updatefavouritechat", authenticateToken, (req, res) =>
    updateFavouriteChat(req, res, supabase)
  );

  return favouriteRouter;
};
