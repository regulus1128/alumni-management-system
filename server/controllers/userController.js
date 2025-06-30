import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import Alumni from "../models/alumni.model.js";
import Student from "../models/student.model.js";
import Admin from "../models/admin.model.js";
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const DEFAULT_AVATAR_URL = "https://res.cloudinary.com/dlxh0ox93/image/upload/v1745256403/default-avatar-profile-icon-of-social-media-user-vector_pb5cai.jpg";



const createToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role || user.userType }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });
}

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER, // your-email@gmail.com
      pass: process.env.MAIL_PASSWORD // Gmail App Password
    }
  });
};

const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Your Email Verification Code',
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px;">
      <h2 style="color: #2c3e50; margin-top: 0;">🔐 Email Verification</h2>
      <p style="font-size: 16px; color: #333;">Hi there,</p>
    
      <p style="font-size: 16px; color: #333;">
        Thank you for registering on the <strong>Alumni Portal</strong>. To complete your registration, please verify your email address by entering the code below:
      </p>
    
      <div style="background-color: #f0f4ff; padding: 25px; text-align: center; margin: 30px 0; border-radius: 6px;">
        <h1 style="color: #1d4ed8; font-size: 36px; letter-spacing: 4px; margin: 0;">${verificationCode}</h1>
      </div>
    
      <p style="font-size: 16px; color: #333;">This code is valid for the next <strong>10 minutes</strong>. Please do not share this code with anyone.</p>
    
      <p style="font-size: 14px; color: #888;">
        Didn’t request this email? No worries — you can safely ignore it.
      </p>
    
      <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
    
      
    </div>
    
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};


const registerUser = async (req, res) => {
  try {
    const { userType } = req.body;

    if (!userType || !["alumni", "currentstudent"].includes(userType)) {
      return res.status(400).json({ message: "Invalid or missing user type" });
    }

    let uploadedAvatar;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars",
      });
      uploadedAvatar = result.secure_url;
    }

    const avatarUrl = uploadedAvatar || DEFAULT_AVATAR_URL;

    if (userType === "alumni") {
      const { name, email, password, gender, graduatedIn, dept, jobRole, company, phone } = req.body;

      if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Please enter a valid email!" });
      }

      if (password.length < 6) {
        return res.status(401).json({ message: "Password must be at least 6 characters!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newAlumni = await Alumni.create({
        name,
        email,
        password: hashedPassword,
        gender,
        graduatedIn: parseInt(graduatedIn),
        dept,
        jobRole,
        company,
        phone,
        avatar: avatarUrl,
      });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000;

      newAlumni.verificationCode = code;
      newAlumni.verificationCodeExpires = new Date(expires);
      await newAlumni.save();

      // Send email using Gmail SMTP
      const emailResult = await sendVerificationEmail(email, code);
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail registration, just log the error
      }

      const token = createToken(newAlumni);

      const isProd = process.env.NODE_ENV === "production";

      res
        .cookie("token", token, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "None" : "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "Alumni registered successfully",
          token,
          user: newAlumni,
          success: true,
          emailSent: emailResult.success
        });
    }

    if (userType === "currentstudent") {
      const { name, email, password, gender, dept, pursuing, batch, phone } = req.body;

      if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Please enter a valid email!" });
      }

      if (password.length < 6) {
        return res.status(401).json({ message: "Password must be at least 6 characters!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newStudent = await Student.create({
        name,
        email,
        password: hashedPassword,
        gender,
        dept,
        pursuing,
        batch: parseInt(batch),
        phone,
        avatar: avatarUrl,
      });

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 10 * 60 * 1000;

      newStudent.verificationCode = code;
      newStudent.verificationCodeExpires = new Date(expires);
      await newStudent.save();

      // Send email using Gmail SMTP
      const emailResult = await sendVerificationEmail(email, code);
      if (!emailResult.success) {
        console.error('Failed to send verification email:', emailResult.error);
        // Don't fail registration, just log the error
      }

      const token = createToken(newStudent);

      const isProd = process.env.NODE_ENV === "production";


      res
        .cookie("token", token, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "None" : "Lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          message: "Student registered successfully",
          token,
          user: newStudent,
          success: true,
          emailSent: emailResult.success
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format!" });
    }
    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required!" });
    }

    // Admin
    let user = await Admin.findOne({ email });

    if (user && user.email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: user._id, role: "admin" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const isProd = process.env.NODE_ENV === "production";


      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: isProd ? "None" : "Lax",
          secure: isProd,
        })
        .status(200)
        .json({
          message: "Admin login successful",
          user: { id: user._id, name: "Admin", role: "admin" },
        });
    }

    // Student
    user = await Student.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }

      const token = jwt.sign(
        { id: user._id, role: "student" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const isProd = process.env.NODE_ENV === "production";


      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: isProd ? "None" : "Lax",
          secure: isProd,
        })
        .status(200)
        .json({
          message: "Student login successful",
          user: { id: user._id, name: user.name, role: "student" },
        });
    }

    // Alumni
    user = await Alumni.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }

      const token = jwt.sign(
        { id: user._id, role: "alumni" },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const isProd = process.env.NODE_ENV === "production";

      return res
        .cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          sameSite: isProd ? "None" : "Lax",
          secure: isProd,
        })
        .status(200)
        .json({
          message: "Alumni login successful",
          user: { id: user._id, name: user.name, role: "alumni" },
        });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decoded);

    let user;
    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } else if (decoded.role === "student") {
      user = await Student.findById(decoded.id);
    } else if (decoded.role === "alumni") {
      user = await Alumni.findById(decoded.id);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: { id: user._id, name: user.name, role: decoded.role } });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Token is not valid" });
  }
};


// Add logout endpoint
const logoutUser = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Logged out successfully" });
};

export const createAdmin = async (req, res) => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      email,
      password: hashedPassword,
    });

    const token = createToken(newAdmin);

    res.status(201).json({
      message: 'Admin created successfully',
      token,
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }

}

export const verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;

  let user = await Alumni.findOne({ email }) || await Student.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpires < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  user.verified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();

  return res.status(200).json({ message: "Email verified successfully", success: true });
};

export { registerUser, loginUser, verifyUser, logoutUser };