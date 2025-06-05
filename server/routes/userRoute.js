import express from "express";
import { createAdmin, loginUser, logoutUser, registerUser, verifyEmailCode, verifyUser } from "../controllers/userController.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.post('/register', upload.single("avatar"), registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/verify', verifyUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/admin', createAdmin);
userRouter.post('/verify-code', verifyEmailCode);

export default userRouter;