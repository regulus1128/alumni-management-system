import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
    try {
      const { name, code, department } = req.body;
      const createdBy = req.user._id; // Assuming admin is authenticated
  
      // Check if course code already exists
      const existingCourse = await Course.findOne({ code });
      if (existingCourse) {
        return res.status(400).json({ success: false, message: "Course code already exists." });
      }
  
      const newCourse = await Course.create({ name, code, department, createdBy });
  
      res.status(201).json({ success: true, message: "Course created successfully", course: newCourse });
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ success: false, message: "Failed to create course" });
    }
  };

  export const getAllCourses = async (req, res) => {
    try {
      const courses = await Course.find().populate("createdBy", "email");
      res.status(200).json({ success: true, courses });
    } catch (error) {
      console.error("Fetch courses error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch courses" });
    }
  };

  export const updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, code, department } = req.body;
  
      const updated = await Course.findByIdAndUpdate(
        id,
        { name, code, department },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
  
      res.status(200).json({ success: true, message: "Course updated", course: updated });
    } catch (error) {
      console.error("Update course error:", error);
      res.status(500).json({ success: false, message: "Failed to update course" });
    }
  };

  export const deleteCourse = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deleted = await Course.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }
  
      res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
      console.error("Delete course error:", error);
      res.status(500).json({ success: false, message: "Failed to delete course" });
    }
  };
  
  
  
  