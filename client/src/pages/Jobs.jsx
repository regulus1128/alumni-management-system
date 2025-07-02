import React, { useEffect, useState } from "react";
import { IoIosPerson } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { BsSuitcaseLg } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../features/profileSlice";
import { fetchAllJobs, fetchMyApplications } from "../features/jobSlice";
import { CiCalendarDate } from "react-icons/ci";
import DOMPurify from "dompurify";

const Jobs = () => {
  const { mode } = useSelector((state) => state.darkMode);
  const { user, role, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [apps, fetchApps] = useState([]);

  // console.log("user in jobs", user);

  const [fetchedJobs, setFetchedJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await dispatch(fetchAllJobs());
      // console.log("rsponses: ", response.payload.jobs);
      setFetchedJobs(response.payload.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await dispatch(fetchMyApplications());
      // console.log("response in fetch app", response.payload.data.applications);
      fetchApps(response.payload.data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  const loadUserProfile = async () => {
    try {
      await dispatch(fetchUserProfile());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const formatPostedDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`h-full mb-10 ${mode ? 'bg-[#121212] text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
  {/* Post Job Button */}
  <div className="flex justify-center">
    {role === "alumni" && (
      <NavLink to="/job-form">
        <button className="bg-teal-500 mt-5 px-3 py-2 text-white rounded-sm assistant w-48 md:w-60 text-[16px] md:text-[18px] cursor-pointer hover:bg-teal-600 transition-all">
          Post a job opportunity
        </button>
      </NavLink>
    )}
  </div>

  {/* Job Container */}
  <div className="min-h-screen mb-10 mx-4 my-10 md:m-20">
    <div className={`relative flex flex-col rounded-sm shadow-sm ${mode ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-slate-200'}`}>
      <nav className="flex min-w-[240px] flex-col gap-1 p-1.5">
        {fetchedJobs.length > 0 ? fetchedJobs?.map((job) => (
          <div
            id={job._id}
            key={job._id}
            role="button"
            className={`flex w-full items-center rounded-md p-3 transition-all ${
              mode
                ? "hover:bg-[#2a2a2a] text-white"
                : "hover:bg-slate-100 text-slate-800"
            }`}
          >
            <div className="flex flex-col w-full">
              <h1 className="assistant text-2xl md:text-3xl mb-3">
                {job.jobRole}
              </h1>

              <div className="flex mt-2">
                <IoLocationOutline size={20} className="mt-1" />
                <p className="lato-regular text-lg md:text-xl ml-2 mb-2">
                  {job.company} | {job.location}
                </p>
              </div>

              <div className="flex mt-1">
                <IoIosPerson size={20} className="mt-1" />
                <p className="lato-regular text-lg md:text-xl ml-2 mb-2">
                  Posted by {job.postedBy.name}
                </p>
              </div>

              <div
                className={`lato-regular mt-2 text-sm md:text-base ${mode ? "text-gray-300" : "text-gray-800"}`}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(job.description),
                }}
              />

              <div className="flex mt-2">
                <BsSuitcaseLg size={18} className="mt-1" />
                <p className="lato-regular ml-2.5">{job.type}</p>
              </div>

              <div className="flex mt-2">
                <RiMoneyRupeeCircleLine size={20} className="mt-1" />
                <p className="lato-regular md:text-md ml-2 mb-2">
                  {job.salary}/month
                </p>
              </div>

              <div className="flex mt-2">
                <CiCalendarDate size={20} className="mb-1" />
                <p className="lato-regular mb-3 ml-2">
                  Posted at: {formatPostedDate(job.postedAt)}
                </p>
              </div>

              <div className="flex flex-col md:flex-row justify-evenly gap-4 mt-4">
                {(() => {
                  const hasApplied = apps?.some(
                    (app) =>
                      app.job === job._id &&
                      (app.alumni === user?._id || app.student === user?._id)
                  );

                  if (user?._id === job.postedBy._id) {
                    return (
                      <button className="px-3 py-2 text-center bg-gray-500 assistant rounded-sm text-white cursor-not-allowed w-full md:w-60">
                        You cannot apply for this job.
                      </button>
                    );
                  } else if (hasApplied) {
                    return (
                      <button className="px-3 py-2 text-center bg-gray-600 assistant rounded-sm text-white cursor-not-allowed w-full md:w-60">
                        You have already applied!
                      </button>
                    );
                  } else if (user === null) {
                    return (
                      <NavLink
                        className="bg-gray-500 px-2 py-2 text-white text-center rounded-sm assistant w-full md:w-60 cursor-not-allowed"
                        to={`/job-application/${job._id}`}
                      >
                        Please login to apply!
                      </NavLink>
                    );
                  } else {
                    return (
                      <NavLink
                        className="bg-teal-500 px-2 py-2 text-white text-center rounded-sm assistant w-full md:w-60 cursor-pointer hover:bg-teal-600"
                        to={`/job-application/${job._id}`}
                      >
                        Apply for this role
                      </NavLink>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
        )) : <p className="text-center lato-regular text-xl">No jobs found!</p>}
      </nav>
    </div>
  </div>
</div>

  );
};

export default Jobs;
