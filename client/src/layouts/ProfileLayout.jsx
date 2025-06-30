import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

import Profile from "../pages/Profile";
import ProfileJobs from "../pages/ProfileJobs";
import ProfileForums from "../pages/ProfileForums";
import ProfileEvents from "../pages/ProfileEvents";
import ProfileConnections from "../pages/ProfileConnections";
import ProfileChats from "../pages/ProfileChats";
import SidebarForProfile from "../components/SidebarForProfile";
import { useSelector } from "react-redux";

const ProfileLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { mode } = useSelector((state) => state.darkMode);

  return (
    <div className={`min-h-screen flex ${mode ? "bg-[#121212]" : "bg-[#f3f3f3]"}`}>

      {/* Hamburger Menu */}
      <div className="lg:hidden relative bottom-[61px]  left-4 z-10 transition-all duration-300">
        <button
          onClick={() => setIsSidebarOpen((prev) => !prev)}
          className={`text-3xl mt-1 ${!mode ? "text-[#121212]" : "text-[#f3f3f3]"}`}
        >
          <RxHamburgerMenu />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static z-50 top-0 left-0 h-full lg:h-auto transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 w-[16rem] flex-shrink-0`}
      >
        <SidebarForProfile closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-30 z-10 lg:hidden"
        />
      )}

      {/* Main Content */}
      <div className={`flex-grow p-6 lg:p-8 transition-colors duration-300 w-full ${
        mode ? "bg-[#121212] text-gray-100" : "bg-[#f3f3f3] text-gray-700"
      }`}>
        <Routes>
          <Route path="/" element={<Profile />} />
          <Route path="/profile-jobs" element={<ProfileJobs />} />
          <Route path="/profile-events" element={<ProfileEvents />} />
          <Route path="/profile-forums" element={<ProfileForums />} />
          <Route path="/profile-connections" element={<ProfileConnections />} />
          <Route path="/chats/*" element={<ProfileChats />} />
        </Routes>
      </div>
    </div>
  );
};

export default ProfileLayout;
