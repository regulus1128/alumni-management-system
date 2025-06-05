import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post("/send", authorizeRole(["student", "alumni"]), sendMessage);
messageRouter.get("/messages", authorizeRole(["student", "alumni"]), getMessages);

export default messageRouter;