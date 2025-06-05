import express from "express";
import { applyForAJob, deleteJob, getAllJobs, getJobById, getJobsByUser, postJob, updateJobDetails } from "../controllers/jobController.js";
import authorizeRole from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const jobRouter = express.Router();

jobRouter.post('/post-job', authorizeRole(["alumni"]), postJob);
jobRouter.get('/job/:role/:id', authorizeRole(["alumni"]), getJobsByUser);
jobRouter.get("/get-all-jobs", getAllJobs);
jobRouter.get("/get-job-by-id/:id", getJobById);
jobRouter.delete('/delete-job/:id', authorizeRole(["alumni"]), deleteJob);
jobRouter.put('/update-job/:id', authorizeRole(["alumni"]), updateJobDetails);
jobRouter.post('/apply/:id', authorizeRole(["student", "alumni"]), upload.single('resume'), applyForAJob);

export default jobRouter;