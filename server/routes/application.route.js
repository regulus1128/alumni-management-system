import express from "express";
import authorizeRole from "../middlewares/auth.js";
import { getUserApplications, updateApplicationStatus } from "../controllers/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.get("/application/mine", authorizeRole(["student", "alumni"]), getUserApplications);
applicationRouter.put("/status/:id", authorizeRole(["alumni"]), updateApplicationStatus);

export default applicationRouter;