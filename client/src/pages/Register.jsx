import React, { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, registerUser } from "../features/authSlice.js";
import toast from "react-hot-toast";
import axios from "axios";
const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);
  const [userType, setUserType] = useState("Alumni");
  const [codeSent, setCodeSent] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    gender: "Male",
    department: "",
    phone: "",
    graduatedIn: "",
    jobRole: "",
    organization: "",
    pursuing: "",
    batch: "",
  });
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", userDetails.name);
    formData.append("email", userDetails.email);
    formData.append("password", userDetails.password);
    formData.append("gender", userDetails.gender);
    formData.append("phone", userDetails.phone);
    formData.append("dept", userDetails.department);
    formData.append("userType", userType.toLowerCase());
    // console.log(userType.toLowerCase());

    if (userType === "Alumni") {
      formData.append("graduatedIn", userDetails.graduatedIn);
      formData.append("jobRole", userDetails.jobRole);
      formData.append("company", userDetails.organization);
    } else {
      formData.append("pursuing", userDetails.pursuing);
      formData.append("batch", userDetails.batch);
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }
    const resultAction = await dispatch(registerUser(formData));
    // console.log("Register result:", resultAction);
    toast.success("Registration successful!");
    setEmail(userDetails.email);
    setCodeSent(true);
  };

  const handleCodeVerify = async () => {
    try {
      const res = await axios.post(`${backendUrl}/api/user/verify-code`, { email, code: verificationCode }, { withCredentials: true });
      if (res.data.success) {
        toast.success("Email verified successfully!");
        // setCodeSent(false);
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center w-[90%] sm:max-w-md lg:max-w-lg m-auto mt-8 gap-4 transition-colors duration-300 mb-6">
      {!codeSent ? (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full p-8 rounded-2xl bg-white shadow-2xl border border-gray-100 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 assistant mb-2">Create Account</h1>
              <p className="text-gray-600 lato-regular">Join our community today</p>
            </div>

            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <input
                  name="name"
                  onChange={handleChange}
                  value={userDetails.name}
                  placeholder="Full Name"
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  value={userDetails.email}
                  placeholder="Email Address"
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  name="password"
                  type="password"
                  onChange={handleChange}
                  value={userDetails.password}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* Gender Select */}
              <div className="relative">
                <select
                  name="gender"
                  value={userDetails.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* User Type Select */}
              <div className="relative">
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                >
                  <option value="Alumni">Alumni</option>
                  <option value="CurrentStudent">Current Student</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              {/* Conditional Fields */}
              {userType === "Alumni" ? (
                <div className="space-y-4 p-4 bg-teal-50 rounded-xl border border-teal-100">
                  <h3 className="text-lg font-semibold text-teal-800 assistant uppercase">Alumni Information</h3>

                  <input
                    name="graduatedIn"
                    onChange={handleChange}
                    value={userDetails.graduatedIn}
                    placeholder="Graduation Year"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />

                  <input
                    name="department"
                    onChange={handleChange}
                    value={userDetails.department}
                    placeholder="Department"
                    required
                    className={`w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white`}
                  />

                  <input
                    name="jobRole"
                    onChange={handleChange}
                    value={userDetails.jobRole}
                    placeholder="Job Role"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />

                  <input
                    name="organization"
                    onChange={handleChange}
                    value={userDetails.organization}
                    placeholder="Company/Organization"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-800 assistant uppercase">Student Information</h3>

                  <input
                    name="department"
                    onChange={handleChange}
                    value={userDetails.department}
                    placeholder="Department"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />

                  <input
                    name="pursuing"
                    onChange={handleChange}
                    value={userDetails.pursuing}
                    placeholder="Pursuing (e.g., B.Tech, M.Tech)"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />

                  <input
                    name="batch"
                    type="number"
                    onChange={handleChange}
                    value={userDetails.batch}
                    placeholder="Batch Year"
                    required
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-white"
                  />
                </div>
              )}

              {/* Phone Input */}
              <div className="relative">
                <input
                  name="phone"
                  onChange={handleChange}
                  value={userDetails.phone}
                  placeholder="Phone Number"
                  required
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* File Upload */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (optional)</label>
                <input
                  type="file"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none bg-gray-50 focus:bg-white file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-8 py-3 rounded-full cursor-pointer hover:from-teal-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl assistant"
              >
                Create Account
              </button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center">
              <NavLink to="/login">
                <p className="cursor-pointer lato-regular text-gray-600 hover:text-teal-500 transition-colors duration-200 assistant">
                  Already a member?{" "}
                  <span className="font-semibold text-teal-600 hover:text-teal-700">Sign in here</span>
                </p>
              </NavLink>
            </div>
          </div>
        </form>
      ) : (
        <div
          className={`w-full p-8 rounded-2xl bg-white shadow-2xl border border-gray-100 backdrop-blur-sm `}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h2 className={`text-3xl font-bold mb-2 assistant text-gray-900 `}>
              Verify Your Email
            </h2>
            <p className={`text-sm mb-6 text-gray-800`}>
              A 6-digit code was sent to <strong className="text-teal-600">{email}</strong>.
              <br />
              Enter it below to verify your email address.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit verification code"
                className={`w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 text-center text-lg font-mono tracking-widest `}
                maxLength="6"
              />
            </div>

            <button
              onClick={handleCodeVerify}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-8 py-3 rounded-full cursor-pointer hover:from-teal-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl assistant"
            >
              Verify Email Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
