import React from 'react'
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { IoMdNotifications } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from 'date-fns';

const NotificationDropdown = () => {
  const { user } = useSelector((state) => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [timeTick, setTimeTick] = useState(0);
  const { mode } = useSelector((state) => state.darkMode);


  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/notification/notifications`, {
        withCredentials: true,
      });
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/notification/notifications/${id}`, {}, {
        withCredentials: true,
      });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) fetchNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick((prev) => prev + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
    <button onClick={toggleDropdown} className="relative mt-2 ">
      <IoMdNotifications size={25} />
      {notifications.some((n) => !n.read) && (
        <span className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full" />
      )}
    </button>

    {isOpen && (
      <div
        className={`absolute right-0 mt-2 w-[300px] z-50 p-2 rounded-md border shadow-lg transition-colors duration-300 
          ${mode ? "bg-[#1e1e1e] text-white border-gray-700" : "bg-white text-gray-800 border-gray-200"}`}
      >
        <h4 className="text-md font-semibold mb-2 px-2">Notifications</h4>
        {notifications.length === 0 ? (
          <p className={`text-sm px-2 ${mode ? "text-gray-400" : "text-gray-500"}`}>
            No notifications
          </p>
        ) : (
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {notifications.slice(0, 3).map((n) => (
              <li
                key={n._id}
                className={`p-2 text-sm rounded-sm ${
                  n.read
                    ? `${mode ? "bg-[#2a2a2a] text-gray-500" : "bg-gray-50 text-neutral-400"}`
                    : `${mode ? "bg-teal-900 hover:bg-teal-800 text-white" : "bg-neutral-200 hover:bg-neutral-300 text-black"}  font-medium transition cursor-pointer`
                }`}
              >
                <button
                  onClick={async () => {
                    await markAsRead(n._id);
                    setIsOpen(false);
                    navigate(n.link);
                  }}
                  className="block w-full text-left"
                >
                  {n.message}
                </button>
                <p className={`${mode ? "text-gray-400" : "text-neutral-500"} text-xs`}>
                  {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-center mt-3">
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/notifications");
            }}
            className="px-2 py-1 bg-teal-500 hover:bg-teal-600 text-white text-[16px] rounded-sm cursor-pointer transition"
          >
            SHOW ALL NOTIFICATIONS
          </button>
        </div>
      </div>
    )}
  </div>
  );
};


export default NotificationDropdown