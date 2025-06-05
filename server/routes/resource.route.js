import express from "express";
import authorizeRole from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { getDownloadLink, getResourcesByCourse, uploadResource } from "../controllers/resource.controller.js";

const router = express.Router();

router.post("/upload/:courseId", authorizeRole(["student", "alumni"]), upload.single("resource"), uploadResource);
router.get("/:courseId", getResourcesByCourse);
router.get("/download/:resourceId", getDownloadLink);

export default router;