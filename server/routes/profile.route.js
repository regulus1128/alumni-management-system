import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { fetchUserProfile, updateUserProfile } from "../controllers/profile.controller.js";
import upload from "../middlewares/multer.js";

const profileRouter = express.Router();

profileRouter.get("/fetch-profile", authorizeRole(["student", "alumni"]), fetchUserProfile);
profileRouter.put("/update-profile", authorizeRole(["student", "alumni"]), upload.single("avatar"), updateUserProfile);

export default profileRouter;