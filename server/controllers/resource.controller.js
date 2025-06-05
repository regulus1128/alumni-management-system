import cloudinary from "../config/cloudinary.js";
import Resource from "../models/resource.model.js";

export const uploadResource = async (req, res) => {
    try {
      const { title, type } = req.body;
      const { courseId } = req.params;
      const file = req.file;
  
      if (!file) return res.status(400).json({ success: false, message: "No file uploaded" });
  
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw", // for PDF, DOCX, ZIP, etc.
        folder: "study-resources",
      });
  
      const resource = await Resource.create({
        course: courseId,
        title,
        type,
        fileUrl: uploadedFile.secure_url,
        uploadedBy: {
          user: req.user._id,
          role: req.user.role,
        },
      });
  
      res.status(201).json({ success: true, resource, message: "Upload successful!" });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getResourcesByCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const resources = await Resource.find({ course: courseId })
        .populate("uploadedBy.user", "name avatar");
  
      res.status(200).json({ success: true, resources });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  export const getDownloadLink = async (req, res) => {
    try {
      const { resourceId } = req.params;
      const resource = await Resource.findById(resourceId);
  
      if (!resource) return res.status(404).json({ success: false, message: "Resource not found" });
  
      res.status(200).json({ success: true, url: resource.fileUrl });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
