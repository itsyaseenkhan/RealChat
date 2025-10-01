import express from "express";
import { getAllUsers, sendMessage , getMessage, ClearChat } from "../Controller/message.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/users", isAuthenticated, getAllUsers);
router.get("/:id" , isAuthenticated , getMessage);
router.post("/send/:id", isAuthenticated,sendMessage)
router.delete("/clear/:id",isAuthenticated, ClearChat);



export default router;
