import express from "express";
import { getAlumniList } from "../controllers/admin.controller.js";

const alumniRouter = express.Router();

alumniRouter.get("/alumni", getAlumniList);

export default alumniRouter;