import express from "express";
import { loginController } from "../controllers/auth/loginController.js";
import { signupController } from "../controllers/auth/signupController.js";
import {
  forgatePasswordController,
  resetPassword,
} from "../controllers/auth/forgotPasswordController.js";

const authRouter = express.Router();

export default (supabase) => {
  // login routes
  authRouter.post("/login", (req, res) => loginController(req, res, supabase));
  authRouter.post("/forgot-password", (req, res) =>
    forgatePasswordController(req, res, supabase),
  );
  authRouter.post("/reset-password", (req, res) =>
    resetPassword(req, res, supabase),
  );
  // signup routes
  authRouter.post("/signup", (req, res) =>
    signupController(req, res, supabase),
  );

  return authRouter;
};
