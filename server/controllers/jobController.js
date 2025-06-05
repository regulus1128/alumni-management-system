import cloudinary from "../config/cloudinary.js";
import Application from "../models/application.model.js";
import Job from "../models/job.model.js";
import mongoose from "mongoose";
import Alumni from "../models/alumni.model.js";
import Student from "../models/student.model.js";
import Notification from "../models/notification.model.js";

const postJob = async (req, res) => {
  try {
    const { jobRole, company, location, description, jobType, salary } = req.body;

    if (req.user.role !== 'alumni') {
      return res.status(403).json({ message: "Only alumni can post jobs!" });
    }

    if (!jobRole || !company || !location || !description || !jobType || !salary) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newJob = await Job.create({
      jobRole,
      company,
      location,
      description,
      type: jobType,
      salary,
      postedBy: req.user._id, // Mongoose uses _id
    });

    await Alumni.findByIdAndUpdate(req.user._id, {
      $push: { jobs: newJob._id }
    });

    res.status(201).json({ message: "Job posted successfully!", job: newJob });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('postedBy', 'name _id').sort({ postedAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};


const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id).populate({
      path: 'applications',
      select: 'name email contact resume _id status',
      match: { status: 'Pending' },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateJobDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { jobRole, company, location, description, jobType, salary } = req.body;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { jobRole, company, location, description, type: jobType, salary },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Job details updated!", job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    await Application.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Job deleted successfully!", job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const applyForAJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, contact, reason } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;
    const job = await Job.findById(id);
    // console.log(job);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (userRole === "alumni" && job.postedBy.toString() === userId.toString()) {
      return res.status(403).json({ success: false, message: "You cannot apply to your own job posting." });
    }

    const jobObjectId = new mongoose.Types.ObjectId(id);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const matchQuery = {
      job: jobObjectId,
      ...(userRole === "student" ? { student: userObjectId } : { alumni: userObjectId }),
    };


    const existingApplication = await Application.findOne(matchQuery);


    if (existingApplication) {
      return res.status(400).json({ success: false, message: "You have already applied for this job!" });
    }

    let resumeUrl = null;
    if(req.file){
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: 'raw',
        folder: 'resumes',
      });
      resumeUrl = result.secure_url;
    }

    const application = await Application.create({
      name,
      email,
      contact,
      resume: resumeUrl,
      reason,
      job: id,
      ...(userRole === "student" ? { student: userObjectId } : { alumni: userObjectId }),
    });

    
if (userRole === "student") {
  await Student.findByIdAndUpdate(userId, {
    $push: { applications: application._id }
  });
} else if (userRole === "alumni") {
  await Alumni.findByIdAndUpdate(userId, {
    $push: { applications: application._id }
  });
}

    job.applications.push(application._id);
    await job.save();

    await Notification.create({
      recipient: job.postedBy,
      recipientModel: 'alumni',
      type: 'job-application',
      message: `${req.body.name} applied for your job post "${job.jobRole}"`,
      link: `/profile/profile-jobs`,
    });

    res.status(200).json({ success: true, application, message: "Applied for the job successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


const getJobsByUser = async (req, res) => {
  try {
    const { id, role } = req.params;

    if (role !== "alumni") {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    const jobs = await Job.find({ postedBy: id }).populate({
      path: 'applications',
      select: 'name email contact resume _id status',
      match: { status: 'Pending' },
    });

    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export { postJob, getAllJobs, getJobById, deleteJob, updateJobDetails, applyForAJob, getJobsByUser };