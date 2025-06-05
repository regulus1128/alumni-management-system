import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { getOrCreateConversation, getUserConversations } from "../controllers/conversation.controller.js";

const conversationRouter = express.Router();

conversationRouter.post("/conversation", authorizeRole(["student", "alumni"]), getOrCreateConversation);
conversationRouter.post("/conversations", authorizeRole(["student", "alumni"]), getUserConversations);

export default conversationRouter;