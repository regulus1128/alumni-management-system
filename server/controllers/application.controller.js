import { APPLICATION_STATUS } from "../constants/constants.js";
import Application from "../models/application.model.js";
import mongoose from "mongoose";

export const getUserApplications = async (req, res) => {
    try {
      const userId = req.user._id;
      const userRole = req.user.role;

      console.log(userId, userRole);
  
      let applications;

      const userObjectId = new mongoose.Types.ObjectId(userId);

      console.log(userObjectId);
  
      if (userRole === "student") {
        applications = await Application.find({ student: userObjectId })
          
      } else if (userRole === "alumni") {
        applications = await Application.find({ alumni: userObjectId }).lean()
          
      } else {
        return res.status(403).json({ success: false, message: "Invalid user role" });
      }

      console.log(applications);
  
      res.status(200).json({ success: true, applications });
    } catch (error) {
      console.error("Error fetching user applications:", error);
      res.status(500).json({ success: false, message: "Failed to fetch applications" });
    }
  };

  export const updateApplicationStatus = async (req, res) => {
    try {
      const { id } = req.params; // application ID
      const { status } = req.body;
    console.log(req.params.id);

  
      // Validate status
      if (!APPLICATION_STATUS.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'Pending', 'Accepted', or 'Rejected'.",
        });
      }
  
      // Find and update the application
      const updatedApplication = await Application.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!updatedApplication) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
  
      return res.status(200).json({
        success: true,
        message: `Application status updated to '${status}'.`,
        application: updatedApplication,
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };