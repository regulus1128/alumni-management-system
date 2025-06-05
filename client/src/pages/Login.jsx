import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/authSlice.js';
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);

  
  const { user, loading, error } = useSelector((state) => state.auth);
  
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // If user is already logged in, redirect to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await dispatch(loginUser(userDetails)).unwrap();
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err || "Login failed");
    }
  };

  return (
    <form
  onSubmit={handleSubmit}
  className={`flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 transition-colors duration-300 ${
    mode ? "text-white" : "text-gray-800"
  }`}
>
  <div className={`w-full ${mode ? "bg-[#1e1e1e]" : "bg-white"} p-6 rounded-md`}>
    <p className="text-3xl mb-4 assistant">Login</p>

    <input
      type="email"
      name="email"
      onChange={handleChange}
      value={userDetails.email}
      className={`w-full px-3 py-2 border rounded-sm lato-regular mt-2 ${
        mode ? "bg-[#2a2a2a] border-gray-600 text-white" : "border-neutral-500"
      }`}
      placeholder="Email"
      required
    />

    <input
      type="password"
      name="password"
      onChange={handleChange}
      value={userDetails.password}
      className={`w-full px-3 py-2 border rounded-sm lato-regular mt-2 ${
        mode ? "bg-[#2a2a2a] border-gray-600 text-white" : "border-neutral-500"
      }`}
      placeholder="Password"
      required
    />

    <button
      className="bg-teal-500 text-white font-medium px-8 w-full py-2 mt-4 rounded-sm cursor-pointer hover:bg-teal-600 assistant"
      disabled={loading}
    >
      {loading ? "Logging in..." : "Click here to log in"}
    </button>

    {error && <p className="text-red-500 mt-2">{error}</p>}

    <NavLink to="/register">
      <p className="cursor-pointer lato-regular text-[17px] hover:text-teal-500 mt-3 assistant">
        New here? Click here to sign up.
      </p>
    </NavLink>
  </div>

  <Toaster position="top-center" />
</form>

  );
};

export default Login;