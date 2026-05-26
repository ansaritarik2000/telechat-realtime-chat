import express from "express";
import chatRoutes from "./telechat/chatRoutes.js";
import groupRoutes from "./telechat/groupRoutes.js";

const teleRouter = express.Router();

export default (supabase) => {
    teleRouter.use("/chat", chatRoutes(supabase));
    teleRouter.use("/chat", chatRoutes(supabase));
    teleRouter.use("/group", groupRoutes(supabase));
    return teleRouter;
};
