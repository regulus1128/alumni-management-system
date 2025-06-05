import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { deleteAlumni, deleteEvent, deleteForum, deleteJob, deleteStudent, getAlumniList, getEventsList, getForumList, getJobsList, getStudentList, updateVerificationStatus } from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/alumni", authorizeRole(["admin"]), getAlumniList);
adminRouter.get("/students", authorizeRole(["admin"]), getStudentList);
adminRouter.get("/jobs", authorizeRole(["admin"]), getJobsList);
adminRouter.get("/forums", authorizeRole(["admin"]), getForumList);
adminRouter.get("/events", authorizeRole(["admin"]), getEventsList);
adminRouter.patch("/verify/:userType/:id", authorizeRole(["admin"]), updateVerificationStatus);
adminRouter.delete("/delete-alumni/:id", authorizeRole(["admin"]), deleteAlumni);
adminRouter.delete("/delete-student/:id", authorizeRole(["admin"]), deleteStudent);
adminRouter.delete("/delete-job/:id", authorizeRole(["admin"]), deleteJob);
adminRouter.delete("/delete-event/:id", authorizeRole(["admin"]), deleteEvent);
adminRouter.delete("/delete-forum/:id", authorizeRole(["admin"]), deleteForum);


export default adminRouter;