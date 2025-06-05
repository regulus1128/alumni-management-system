import cloudinary from "../config/cloudinary.js";
import Alumni from "../models/alumni.model.js";
import Student from "../models/student.model.js";

const DEFAULT_AVATAR = "https://res.cloudinary.com/dlxh0ox93/image/upload/v1745256403/default-avatar-profile-icon-of-social-media-user-vector_pb5cai.jpg"


export const fetchUserProfile = async (req, res) => {
    try {
      console.log(req.user);
      const userId = req.user._id;
  
      if (req.user.role === 'student') {
        const user = await Student.findById(userId).select(
          '_id name email phone gender dept pursuing batch avatar verified applications joinedEvents'
        ).populate('joinedEvents', 'name location createdAt dateTime').populate({
          path: 'applications',
          populate: {
            path: 'job',
            select: 'jobRole company location type',
          },
        });
        return res.status(200).json({ success: true, user, role: req.user.role });
  
      } else if (req.user.role === 'alumni') {
        const user = await Alumni.findById(userId).select(
          '_id name email phone gender graduatedIn dept jobRole company avatar verified applications joinedEvents'
        )
        .populate({
          path: 'applications',
          populate: {
            path: 'job',
            select: 'jobRole company location type',
          },
        }).populate('joinedEvents', 'name location createdAt dateTime');
        return res.status(200).json({ success: true, user, role: req.user.role });
  
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.user._id;
  
      let uploadedImage;
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'avatars',
        });
        uploadedImage = result.secure_url;
      }
      const imageUrl = uploadedImage || DEFAULT_AVATAR;
  
      if (req.user.role === 'student') {
        const { name, email, gender, dept, pursuing, batch, phone } = req.body;
  
        const updatedUser = await Student.findByIdAndUpdate(
          userId,
          {
            name,
            email,
            gender,
            dept,
            pursuing,
            batch: batch ? Number(batch) : undefined,
            phone,
            avatar: imageUrl,
          },
          { new: true }
        );

        // console.log(updatedUser);
  
        return res.status(200).json({ success: true, updatedUser, role: req.user.role });
  
      } else if (req.user.role === 'alumni') {
        const { name, email, gender, dept, graduatedIn, jobRole, company, phone } = req.body;
  
        const updatedUser = await Alumni.findByIdAndUpdate(
          userId,
          {
            name,
            email,
            gender,
            dept,
            graduatedIn: graduatedIn ? Number(graduatedIn) : undefined,
            jobRole,
            company,
            phone,
            avatar: imageUrl,
          },
          { new: true }
        );
  
        return res.status(200).json({ success: true, updatedUser, role: req.user.role });
      }
  
      return res.status(400).json({ message: "Invalid user role" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
