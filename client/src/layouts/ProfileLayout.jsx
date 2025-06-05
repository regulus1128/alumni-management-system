import React, { useEffect, useState } from "react";
import SidebarForProfile from "../components/SidebarForProfile";
import { Route, Routes } from "react-router-dom";
import Profile from "../pages/Profile";
import ProfileEvents from "../pages/ProfileEvents";
import ProfileJobs from "../pages/ProfileJobs";
import ProfileForums from "../pages/ProfileForums";
import ProfileConnections from "../pages/ProfileConnections";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../features/profileSlice.js";
import ProfileChats from "../pages/ProfileChats.jsx";

const ProfileLayout = () => {
  const { user, role, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.darkMode);

  const [details, setDetails] = useState({});
  // console.log("user from store:", user);

  const loadUserProfile = async () => {
    try {
      const response = await dispatch(fetchUserProfile());
      // console.log("response in profile layout: ", response.payload.user);
      setDetails(response.payload.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Return loading state if user data is not available yet
  if (!user || !role) {
    return <div className="flex-grow p-8 bg-white">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <SidebarForProfile />
      <div className={`flex-grow p-8 ${mode ? "bg-[#121212] text-gray-100" : "bg-[#f3f3f3] text-gray-700"}`}>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route 
            path="/profile-events" 
            element={<ProfileEvents />} 
          />
          <Route
            path="/profile-jobs"
            element={<ProfileJobs />}
          />
          <Route
            path="/profile-forums"
            element={<ProfileForums />}
          />
          <Route
            path="/profile-connections"
            element={<ProfileConnections />}
          />
          <Route
            path="/chats/*"
            element={<ProfileChats />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default ProfileLayout;