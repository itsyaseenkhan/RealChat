import express from "express";
import { Signup,Signin,Signout,getUser,updateProfile, forgotPassword , resetPassword  } from "../Controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/Sign-up", Signup);
router.post("/Sign-in", Signin);
router.get("/Sign-out", isAuthenticated, Signout);
router.get("/me", isAuthenticated, getUser);
router.put("/update-Profile", isAuthenticated, updateProfile);
router.post("/Password/forgot", forgotPassword);
router.put("/Password/reset/:token", resetPassword);

export default router;
