import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { IoMdHome } from "react-icons/io";
import { toggleDarkMode } from "../features/DarkModeSlice";
import NotificationDropdown from "./NotificationDropdown";
import { IoIosSunny } from "react-icons/io";
import { IoMdMoon } from "react-icons/io";

const Navbar = () => {
  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  
  
  const { user } = useSelector((state) => state.auth);

  // console.log('user in navbar: ', user);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  return (
    <div className={`flex justify-around items-center py-5 font-medium border-b-2 ${mode ? 'bg-[#171717] text-white border-gray-800' : 'bg-white border-gray-200'}`}>
      <NavLink to="/" className="ml-4">
      <IoMdHome size={30}/>
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6 text-md assistant text-[18px]">

      {!!user && user.role !== "admin" ? (<NavLink to="/alumni" className="relative">
          <p>Alumni</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>) : ""}
        

        {!!user && user.role !== "admin" ? (<NavLink to="/jobs" className="relative">
          <p>Jobs</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>) : ""}

        

        {!!user && user.role !== "admin" ? (<NavLink to="/forums" className="relative">
          <p>Forums</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>) : ""}

        

        {!!user && user.role !== "admin" ? (<NavLink to="/events" className="relative">
          <p>Events</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>) : ""}
        

        {!!user && user.role !== "admin" ? (<NavLink to="/courses" className="relative">
          <p>Courses</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>
) : ""}

        
        {!!user && user.role !== "admin" ? (
          <NavLink to="/profile" className="relative">
          <p>Profile</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>
        ) : ""}

        {!!user && user.role !== "admin" ? (
          <>
          <NotificationDropdown/>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
          </>
        
        ) : ""}

        
        {!!user && user.role === "admin" ? (<NavLink to="/dashboard" className="relative">
          <p>Dashboard</p>
          <hr className="absolute  w-full border-none h-1 bg-teal-400 hidden" />
        </NavLink>) : ""}

        <button 
        onClick={() => dispatch(toggleDarkMode())}
        className="mr-4 p-2 rounded-full cursor-pointer"
      >
        {mode ? <IoIosSunny size={25}/> : <IoMdMoon size={25}/>}
      </button>
        
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden mr-4 " onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Dark Mode Toggle */}
       

      {/* Mobile Menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden absolute top-16 left-0 right-0 bg-white  border-b border-gray-200 z-10`}>
        <div className="flex flex-col items-center gap-4 py-4 ">
          <NavLink className="hover:underline" to="/alumni">Alumni</NavLink>
          <NavLink className="hover:underline" to="/jobs">Jobs</NavLink>
          <NavLink className="hover:underline" to="/forums">Forums</NavLink>
          <NavLink className="hover:underline" to="/events">Events</NavLink>
          <NavLink className="hover:underline" to="/profile">Profile</NavLink>
          <NavLink className="hover:underline" to="/dashboard">Dashboard</NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
