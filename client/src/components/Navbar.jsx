import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { IoMdHome } from "react-icons/io";
import { toggleDarkMode } from "../features/DarkModeSlice";
import NotificationDropdown from "./NotificationDropdown";
import { IoIosSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // console.log('user in navbar: ', user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className={`assistant text-xl flex justify-between items-center py-5 px-4 font-medium border-b-2 ${
        mode
          ? "bg-[#171717] text-white border-gray-800"
          : "bg-white border-gray-200"
      }`}
    >
      <NavLink to="/" className="ml-12 hidden md:block">
        ALUMVERSE
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-md assistant text-[18px]">
        {user && user.role !== "admin" ? (
          <NavLink to="/alumni" className="relative">
            <p>Alumni</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <NavLink to="/jobs" className="relative">
            <p>Jobs</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <NavLink to="/forums" className="relative">
            <p>Forums</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <NavLink to="/events" className="relative">
            <p>Events</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <NavLink to="/courses" className="relative">
            <p>Courses</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <NavLink to="/profile" className="relative">
            <p>Profile</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        {user && user.role !== "admin" ? (
          <>
            <NotificationDropdown />
            <hr className="absolute w-full border-none h-1 bg-teal-400 hidden" />
          </>
        ) : (
          ""
        )}

        {!!user && user.role === "admin" ? (
          <NavLink to="/dashboard" className="relative">
            <p>Dashboard</p>
            <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </NavLink>
        ) : (
          ""
        )}

        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="mr-4 p-2 rounded-full cursor-pointer"
        >
          {mode ? <IoIosSunny size={25} /> : <IoMdMoon size={25} />}
        </button>
      </div>

      {/* Mobile Menu Button */}
      {user && user.role !== "admin" && (
        <div className="md:hidden flex items-center gap-4 ml-auto">
          <button onClick={() => dispatch(toggleDarkMode())} className="p-2 rounded-full">
            {mode ? <IoIosSunny size={25} /> : <IoMdMoon size={25} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <RxHamburgerMenu className="text-2xl" />
          </button>
        </div>
      )}

      {/* Mobile Menu */}

{/* Overlay */}
<div
  className={`fixed inset-0 z-40 transition-opacity duration-300 ${
    mobileMenuOpen ? "inset-0 bg-black opacity-30 z-50 pointer-events-auto" : "opacity-0 pointer-events-none"
  }`}
  onClick={() => setMobileMenuOpen(false)}
></div>

{/* Top Dropdown */}
<div
  className={`fixed top-0 left-0 right-0 z-50 shadow-md transition-all duration-300 ease-out transform border-b-2 ${
    mobileMenuOpen
      ? "translate-y-0 opacity-100 pointer-events-auto"
      : "-translate-y-10 opacity-0 pointer-events-none"
  } ${mode ? "bg-[#171717] text-white border-t border-gray-800" : "bg-white text-gray-800 border-t border-gray-200"}`}
>
  <div className="flex flex-col items-center gap-4 py-6">
    {[
      { to: "/alumni", label: "Alumni" },
      { to: "/jobs", label: "Jobs" },
      { to: "/forums", label: "Forums" },
      { to: "/events", label: "Events" },
      { to: "/courses", label: "Courses" },
      { to: "/profile", label: "Profile" },
      ...(user?.role === "admin" ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ].map(({ to, label }) => (
      <NavLink
        key={to}
        to={to}
        onClick={() => setMobileMenuOpen(false)}
        className="hover:underline text-lg transition"
      >
        {label}
      </NavLink>
    ))}
  </div>
</div>



    </div>
  );
};

export default Navbar;
