import React, { use, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, registerUser } from "../features/authSlice.js";
import toast from "react-hot-toast";
import axios from "axios";
const backendURL = import.meta.env.VITE_BACKEND_URL;

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
    console.log("Register result:", resultAction);
    toast.success("Registration successful!");
    setEmail(userDetails.email);
    setCodeSent(true);
  };

  const handleCodeVerify = async () => {
    try {
      const res = await axios.post(`${backendURL}/api/user/verify-code`, { email, code: verificationCode }, { withCredentials: true });
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
    <div
      className={`min-h-screen flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 transition-colors duration-300 ${
        mode ? "text-white" : "text-gray-800"
      }`}
    >
      {!codeSent ? (
        <form onSubmit={handleSubmit}>
          <div
            className={`w-full ${
              mode ? "bg-[#1e1e1e]" : "text-gray-800"
            } p-6 rounded-md`}
          >
            <p className="text-3xl mb-4 assistant">Register</p>

            {/* all input fields as before */}
            <input
              name="name"
              onChange={handleChange}
              value={userDetails.name}
              placeholder="Name"
              required
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            />
            <input
              name="email"
              type="email"
              onChange={handleChange}
              value={userDetails.email}
              placeholder="Email"
              required
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            />
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={userDetails.password}
              placeholder="Password"
              required
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            />
            <select
              name="gender"
              value={userDetails.gender}
              onChange={handleChange}
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            >
              <option value="Alumni">Alumni</option>
              <option value="CurrentStudent">Current Student</option>
            </select>

            {userType === "Alumni" ? (
              <>
                <input
                  name="graduatedIn"
                  onChange={handleChange}
                  value={userDetails.graduatedIn}
                  placeholder="Graduation Year"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  required
                />
                <input
                  name="department"
                  onChange={handleChange}
                  value={userDetails.department}
                  placeholder="Department"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  required
                />
                <input
                  name="jobRole"
                  onChange={handleChange}
                  value={userDetails.jobRole}
                  placeholder="Job Role"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  
                />
                <input
                  name="organization"
                  onChange={handleChange}
                  value={userDetails.organization}
                  placeholder="Company/Organization"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  
                />
              </>
            ) : (
              <>
                <input
                  name="department"
                  onChange={handleChange}
                  value={userDetails.department}
                  placeholder="Department"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  required
                />
                <input
                  name="pursuing"
                  onChange={handleChange}
                  value={userDetails.pursuing}
                  placeholder="Pursuing"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  required
                />
                <input
                  name="batch"
                  type="number"
                  onChange={handleChange}
                  value={userDetails.batch}
                  placeholder="Batch"
                  className={`input-style ${
                    mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
                  }`}
                  required
                />
              </>
            )}

            <input
              name="phone"
              onChange={handleChange}
              value={userDetails.phone}
              placeholder="Phone"
              required
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            />
            <input
              type="file"
              onChange={(e) => setAvatar(e.target.files[0])}
              className={`input-style ${
                mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
              }`}
            />

            <button
              type="submit"
              className="bg-teal-500 text-white font-medium px-8 w-full py-2 mt-4 rounded-sm cursor-pointer hover:bg-teal-600 assistant"
            >
              Click Here To Register
            </button>

            <NavLink to="/login">
              <p className="cursor-pointer lato-regular text-[17px] hover:text-teal-600 mt-3 assistant">
                Already a member? Click here to login.
              </p>
            </NavLink>
          </div>
        </form>
      ) : (
        <div
          className={`w-full ${
            mode ? "bg-[#1e1e1e]" : "text-gray-800"
          } p-6 rounded-md`}
        >
          <p className="text-2xl mb-4 assistant">Verify Your Email</p>
          <p className="text-sm mb-2">
            A 6-digit code was sent to <strong>{email}</strong>. Enter it below to verify your email.
          </p>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter the verification code"
            className={`input-style ${
              mode ? "bg-[#2a2a2a] text-white border-gray-600" : ""
            }`}
          />
          <button
            onClick={handleCodeVerify}
            className="bg-teal-500 text-white font-medium px-8 w-full py-2 mt-4 rounded-sm cursor-pointer hover:bg-teal-600 assistant"
          >
            Verify Code
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
