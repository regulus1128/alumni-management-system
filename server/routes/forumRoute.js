import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { deleteForum, getAllForums, getForumById, getForumsByUser, postForum, updateForum } from "../controllers/forumController.js";
import upload from "../middlewares/multer.js";

const forumRouter = express.Router();

forumRouter.post("/post-forum", authorizeRole(["student", "alumni"]), upload.single("image"), postForum);
forumRouter.get("/forum/:role/:id", authorizeRole(["student", "alumni"]), getForumsByUser);
forumRouter.get("/get-forums", getAllForums);
forumRouter.get("/get-forum/:id", getForumById);
forumRouter.put("/edit/:id", authorizeRole(["student", "alumni"]), upload.single("image"), updateForum);
forumRouter.delete("/delete-forum/:id", authorizeRole(["student", "alumni"]), deleteForum);


export default forumRouter;

