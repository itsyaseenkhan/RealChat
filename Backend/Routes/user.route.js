import express from "express";
import {
  Signup,
  Signin,
  Signout,
  getUser,
  updateProfile,
  getAllUsers,
} from "../Controller/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/Sign-up", Signup);
router.post("/Sign-in", Signin);
router.get("/Sign-out", isAuthenticated, Signout);
router.get("/me", isAuthenticated, getUser);
router.get("/all", isAuthenticated, getAllUsers); 
router.put("/update-Profile", isAuthenticated, updateProfile);

export default router;
