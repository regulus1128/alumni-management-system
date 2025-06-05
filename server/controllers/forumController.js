import cloudinary from "../config/cloudinary.js";
import Alumni from "../models/alumni.model.js";
import Forum from "../models/forum.model.js";
import Student from "../models/student.model.js";


const DEFAULT_FORUM_PIC = "https://res.cloudinary.com/dlxh0ox93/image/upload/v1745346662/classroom_teuut6.jpg";

const postForum = async (req, res) => {
    try {
      const { title, description } = req.body;
      const { _id, role } = req.user;
  
      if (!title || !description) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Upload image to Cloudinary
      let uploadedImage;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "forums",
        });
        uploadedImage = result.secure_url;
      }
  
      const imageUrl = uploadedImage || DEFAULT_FORUM_PIC;
  
      const forumData = {
        title,
        description,
        image: imageUrl,
        ...(role === "student" ? { student: _id } : { alumni: _id }),
      };
  
      const newForum = await Forum.create(forumData);
  
      // Push forum ID to user
      if (role === "student") {
        await Student.findByIdAndUpdate(_id, {
          $push: { forums: newForum._id },
        });
      } else {
        await Alumni.findByIdAndUpdate(_id, {
          $push: { forums: newForum._id },
        });
      }
  
      res.status(201).json({ message: "Forum posted successfully!", forum: newForum });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const getAllForums = async (req, res) => {
    try {
      const forums = await Forum.find()
        .populate('alumni', 'name avatar')
        .populate('student', 'name avatar')
        .sort({ createdAt: -1 });
  
      res.status(200).json({ success: true, forums });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const getForumById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const forum = await Forum.findById(id)
        .populate('alumni', 'name avatar')
        .populate('student', 'name avatar');
  
      if (!forum) {
        return res.status(404).json({ success: false, message: "Forum not found" });
      }
  
      res.status(200).json({ success: true, forum });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const updateForum = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;
  
      const forum = await Forum.findById(id);
      if (!forum) {
        return res.status(404).json({ success: false, message: "Forum not found" });
      }
  
      let uploadedImage;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "forums",
        });
        uploadedImage = result.secure_url;
      }
  
      const imageUrl = uploadedImage || DEFAULT_FORUM_PIC;
  
      const updatedForum = await Forum.findByIdAndUpdate(
        id,
        { title, description, image: imageUrl },
        { new: true }
      );
  
      res.status(200).json({ success: true, forum: updatedForum, message: "Forum updated successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const deleteForum = async (req, res) => {
    try {
      const { id } = req.params;
  
      const forum = await Forum.findById(id);
      if (!forum) {
        return res.status(404).json({ success: false, message: "Forum not found" });
      }
  
      await Forum.findByIdAndDelete(id);
  
      res.status(200).json({ success: true, message: "Forum deleted successfully!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  export const getForumsByUser = async (req, res) => {
    try {
      const { id, role } = req.params;
  
      let forums;
      if (role === 'student') {
        forums = await Forum.find({ student: id })
          .populate('student')
          .populate('alumni');
      } else if (role === 'alumni') {
        forums = await Forum.find({ alumni: id })
          .populate('student')
          .populate('alumni');
      } else {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
  
      res.status(200).json({ success: true, forums });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

export { postForum, getAllForums, getForumById, updateForum, deleteForum };