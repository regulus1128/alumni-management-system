import Alumni from "../models/alumni.model.js";
import Application from "../models/application.model.js";
import Event from "../models/event.model.js";
import Forum from "../models/forum.model.js";
import Job from "../models/job.model.js";
import Student from "../models/student.model.js";
import Comment from "../models/comment.model.js";
import Connection from "../models/connection.model.js";


const getAlumniList = async (req, res) => {
    try {
      const alumni = await Alumni.find({}).select('name email dept jobRole company phone verified avatar');
  
      res.status(200).json({ success: true, alumni });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
};

export const getStudentList = async (req, res) => {
    try {
        const students = await Student.find({}).select('name email dept pursuing batch phone verified');
        res.status(200).json({ success: true, students });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getJobsList = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('postedBy', 'name');
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getForumList = async (req, res) => {
    try {
        const forums = await Forum.find({}).populate('alumni', 'name').populate('student', 'name');

        res.status(200).json({ success: true, forums });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getEventsList = async (req, res) => {
    try {
        const events = await Event.find({}).populate('alumni', 'name').populate('student', 'name');

        res.status(200).json({ success: true, events });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}



const deleteJob = async (req, res) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findById(id);
  
      if(!job){
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      await Application.deleteMany({ job: job._id });
      await Job.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, job, message: "Job deleted successfully!" });
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, error: error.message });
    }
}


const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedEvent = await Event.findByIdAndDelete(id);

        return res.status(200).json({ message: "Event deleted successfully!", event: deletedEvent });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteForum = async (req, res) => {
    try {
        const { id } = req.params;
        const forum = await Forum.findById(id);

        if(!forum){
            return res.status(404).json({ success: false, message: "Forum not found" });
        }

        await Forum.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Forum deleted successfully!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const deleteAlumni = async (req, res) => {
  try {
    const { id } = req.params;

    const alumni = await Alumni.findById(id);

    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Delete all related documents
    await Promise.all([
      Job.deleteMany({ _id: { $in: alumni.jobs } }),
      Event.deleteMany({ _id: { $in: alumni.events } }),
      Forum.deleteMany({ _id: { $in: alumni.forums } }),
      Comment.deleteMany({ _id: { $in: alumni.comments } }),
      Connection.deleteMany({ 
        $or: [
          { _id: { $in: alumni.sentConnections } },
          { _id: { $in: alumni.receivedConnections } }
        ]
      }),
      Application.deleteMany({ _id: { $in: alumni.applications } }),
    ]);

    // Finally, delete the alumni
    await Alumni.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Alumni and all related data deleted successfully!",
    });

  } catch (error) {
    console.error("Error deleting alumni:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Delete related documents
    await Promise.all([
      Forum.deleteMany({ _id: { $in: student.forums } }),
      Comment.deleteMany({ _id: { $in: student.comments } }),
      Connection.deleteMany({ _id: { $in: student.connections } }),
      Application.deleteMany({ _id: { $in: student.applications } }),
    ]);

    // Finally delete the student
    await Student.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Student and all related data deleted successfully!",
    });

  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

  

const updateVerificationStatus = async (req, res) => {
    try {
      const { id, userType } = req.params;
      const { verified } = req.body;
  
      if (typeof verified !== 'boolean') {
        return res.status(400).json({ success: false, message: "Verified status must be true or false" });
      }
  
      let model;
      if (userType === 'alumni') {
        model = Alumni;
      } else if (userType === 'student') {
        model = Student;
      } else {
        return res.status(400).json({ success: false, message: "Invalid user type" });
      }
  
      const user = await model.findById(id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: `${userType} not found` });
      }
  
      user.verified = verified;
      await user.save();
  
      res.status(200).json({
        success: true,
        message: `${userType} verification status updated`,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          verified: user.verified,
        },
      });
    } catch (error) {
      console.error('Error updating verification status:', error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };

export { getAlumniList, getJobsList, getForumList, getEventsList, deleteJob, deleteEvent, deleteForum, deleteAlumni, updateVerificationStatus };