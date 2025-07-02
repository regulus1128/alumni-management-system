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
  className="flex flex-col items-center justify-center min-h-screen w-[90%] sm:max-w-md m-auto gap-4 transition-colors duration-300"
>
<div className="w-full p-8 rounded-2xl bg-white shadow-2xl border border-gray-100 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 assistant mb-2">Welcome Back!</h1>
          <p className="text-gray-600 lato-regular">Sign in to your account</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={userDetails.email}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              onChange={handleChange}
              value={userDetails.password}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-full lato-regular transition-all duration-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:outline-none placeholder-gray-400 bg-gray-50 focus:bg-white"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold px-8 py-3 rounded-full cursor-pointer hover:from-teal-600 hover:to-teal-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none assistant"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-full">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <NavLink to="/register">
            <p className="cursor-pointer lato-regular text-gray-600 transition-colors duration-200 assistant">
              New here? <span className="font-semibold transition-colors duration-200 text-teal-600 hover:text-teal-700">Create an account.</span>
            </p>
          </NavLink>
        </div>
      </div>

  <Toaster position="top-center" />
</form>

  );
};

export default Login;