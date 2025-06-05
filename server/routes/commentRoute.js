import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { deleteComment, editComment, getAllComments, getCommentById, likeComment, postComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/post-comment/:forumId", authorizeRole(["student", "alumni"]), postComment);
commentRouter.get("/get-all-comments/:forumId", getAllComments);
commentRouter.get("/get-comment/:id", getCommentById);
commentRouter.put("/edit-comment/:id", authorizeRole(["student", "alumni"]), editComment);
commentRouter.delete("/delete-comment/:id", authorizeRole(["student", "alumni"]), deleteComment);
commentRouter.post("/like-comment/:id", authorizeRole(["student", "alumni"]), likeComment);

export default commentRouter;