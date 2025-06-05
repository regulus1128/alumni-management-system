import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { createCourse, getAllCourses, updateCourse, deleteCourse } from "../controllers/course.controller.js";

const courseRouter = express.Router();

courseRouter.get("/", getAllCourses);
courseRouter.post("/add", authorizeRole(["admin"]), createCourse);
courseRouter.patch("/update/:id", authorizeRole(["admin"]), updateCourse);
courseRouter.delete("/delete/:id", authorizeRole(["admin"]), deleteCourse);

export default courseRouter;
