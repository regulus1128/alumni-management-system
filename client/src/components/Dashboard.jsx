import React, { useEffect, useState } from "react";
import axios from "axios";
import { PiStudentFill } from "react-icons/pi";
import { FaSuitcase } from "react-icons/fa";
import { MdForum } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md";
import { useSelector } from "react-redux";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {

  const [alumniList, setAlumniList] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [event, setEvent] = useState([]);
  const [forums, setForums] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/alumni`, {
        withCredentials: true,
      });
      // console.log("alumni: ", res.data.alumni);
      if (res.data.success) {
        setAlumniList(res.data.alumni);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/jobs`, { withCredentials: true });
      // console.log(res.data.jobs);
      if(res.data.success){
        setJobs(res.data.jobs); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/events`, { withCredentials: true });
      // console.log(res.data.events);
      if(res.data.success){
        setEvent(res.data.events); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchForums = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/forums`, { withCredentials: true });
      // console.log(res.data.forums);
      if(res.data.success){
        setForums(res.data.forums); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchAlumni();
    fetchJobs();
    fetchEvents();
    fetchForums();
  }, []);
  return (
    <div
  className={`flex min-h-screen transition-colors duration-300 ${
    mode ? " text-white" : " text-gray-800"
  }`}
>
  {/* Main Content */}
  <div className="flex-grow p-4 sm:p-6 md:p-8 flex justify-center lato-regular">
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
      
      {/* Alumni */}
      <div
        className={`rounded-sm h-60 p-6 shadow-md transition-all duration-300 ${
          mode ? "bg-[#1e1e1e] border border-gray-700" : "bg-[#f8f8f8]"
        }`}
      >
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-2xl mb-3">Alumni</h2>
          <div className="flex items-center mt-2">
            <PiStudentFill size={36} className={mode ? "text-white" : "text-gray-700"} />
            <p className="text-2xl ml-4">{alumniList.length}</p>
          </div>
        </div>
      </div>

      {/* Posted Jobs */}
      <div
        className={`rounded-sm h-60 p-6 shadow-md transition-all duration-300 ${
          mode ? "bg-[#1e1e1e] border border-gray-700" : "bg-[#f8f8f8]"
        }`}
      >
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-2xl mb-3">Posted Jobs</h2>
          <div className="flex items-center mt-2">
            <FaSuitcase size={36} className={mode ? "text-white" : "text-gray-700"} />
            <p className="text-2xl ml-4">{jobs.length}</p>
          </div>
        </div>
      </div>

      {/* Forum Topics */}
      <div
        className={`rounded-sm h-60 p-6 shadow-md transition-all duration-300 ${
          mode ? "bg-[#1e1e1e] border border-gray-700" : "bg-[#f8f8f8]"
        }`}
      >
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-2xl mb-3">Forum Topics</h2>
          <div className="flex items-center mt-2">
            <MdForum size={36} className={mode ? "text-white" : "text-gray-700"} />
            <p className="text-2xl ml-4">{forums.length}</p>
          </div>
        </div>
      </div>

      {/* Events */}
      <div
        className={`rounded-sm h-60 p-6 shadow-md transition-all duration-300 ${
          mode ? "bg-[#1e1e1e] border border-gray-700" : "bg-[#f8f8f8]"
        }`}
      >
        <div className="flex flex-col h-full justify-center">
          <h2 className="text-2xl mb-3">Events</h2>
          <div className="flex items-center mt-2">
            <MdEventAvailable size={36} className={mode ? "text-white" : "text-gray-700"} />
            <p className="text-2xl ml-4">{event.length}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

  );
};

export default Dashboard;
