import express from "express";
import { authenticateToken } from "../middleware/userAuthentication.js";
import { createMemberController } from "../controllers/members/createMemberController.js";
import {
    getMembersController,
    getMemebrById,
    getMemberIdByUserId
} from "../controllers/members/getMemberController.js";
import { updateMemberController } from "../controllers/members/updateMemberController.js";
import { trashMemberController } from "../controllers/members/deleteMemberController.js";
import { getCreatorUsersController } from "../controllers/members/getGraphMemberController.js";
import { getActiveMembersController } from "../controllers/members/getActiveMemberController.js";

const memberRouter = express.Router();

export default (supabase) => {
    // Route to create a member
    memberRouter.post("/create", authenticateToken, (req, res) => {
        createMemberController(req, res, supabase)
    } );

    // Route to get members
    memberRouter.get("/list", authenticateToken, (req, res) =>
        getMembersController(req, res, supabase)
    );

    // Route to get members with ip info
    memberRouter.get("/iplist", authenticateToken, (req, res) =>
        getMemebrsIpInfoController(req, res, supabase)
    );

    // Route to update members
    memberRouter.put("/update", authenticateToken, (req, res) =>
        updateMemberController(req, res, supabase)
    );

    // Route to delete members
    memberRouter.put("/trash", authenticateToken, (req, res) =>
        trashMemberController(req, res, supabase)
    );

    // Route to get users for particular creator
    memberRouter.get("/rolecount", authenticateToken, (req, res) =>
        getCreatorUsersController(req, res, supabase)
    );

    // Route to get active members
    memberRouter.get("/activemembers", authenticateToken, (req, res) =>
        getActiveMembersController(req, res, supabase)
    );
    // Route to get memeber by id
    memberRouter.get('/member/:id', (req, res) =>
        getMemebrById (req, res, supabase))
    memberRouter.get('/memberId/:user_id', (req, res) =>
        getMemberIdByUserId (req, res, supabase))
    return memberRouter;
};
