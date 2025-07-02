import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { deleteJob, getJobsByUser } from "../features/jobSlice.js";
import Application from "./Application.jsx";
import { RxCross1 } from "react-icons/rx";
import toast from "react-hot-toast";

const ProfileJobs = () => {
  const { user, role } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.darkMode);
  const { selectedJobs } = useSelector((state) => state.job);
  const [activeSection, setActiveSection] = useState("applied");
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const openModal = (jobId) => {
    setSelectedJobId(jobId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedJobId(null);
  };

  // console.log("user", user);

  const fetchselectedJobs = async () => {
    try {
      const response = await dispatch(getJobsByUser({ role, id: user._id }));
      // console.log("jobs", response);
      // console.log(selectedJobs);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnjob = async (id) => {
    try {
      const response = await dispatch(deleteJob(id));
      // console.log(response);
      toast.success("job deleted successfully!");
      fetchselectedJobs();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchselectedJobs();
  }, [role, user]);

  useEffect(() => {
    if (user?.applications?.length > 0) {
      setAppliedJobs(user?.applications);
    }
  }, [user]);

  return (
<>
  {/* Tabs */}
  <div className="flex flex-wrap justify-center mb-6 gap-3 sm:gap-4">
    {["applied", "posted"].map((section) => (
      <button
        key={section}
        onClick={() => setActiveSection(section)}
        className={`px-4 sm:px-6 py-2 rounded-sm font-medium lato-regular cursor-pointer text-sm sm:text-base ${
          activeSection === section
            ? "bg-teal-600 text-white"
            : mode
            ? "bg-[#2a2a2a] text-white"
            : "bg-gray-200 text-gray-700"
        } transition-colors duration-200`}
      >
        {section === "applied" ? "Applied Jobs" : "Posted Jobs"}
      </button>
    ))}
  </div>

  {/* Section Container */}
  <div className={`w-full mt-10 rounded-sm transition-colors duration-300 ${mode ? "text-white" : "text-gray-800"}`}>
    {/* Posted Jobs Section */}
    {activeSection === "posted" && (
      <div className="w-full px-4 sm:px-6 pb-6 grid grid-cols-1 gap-4">
        <h2 className="lato-regular text-xl sm:text-2xl">Jobs you have posted</h2>
        {selectedJobs?.length > 0 ? (
          selectedJobs.map((job) => (
            <div
              key={job._id}
              className={`flex flex-col gap-4 md:flex-row md:justify-between items-start md:items-center rounded-sm p-4 shadow-md transition-all ${
                mode ? "bg-[#1e1e1e] hover:bg-[#2a2a2a]" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div>
                <h2 className="lato-regular text-base sm:text-lg">
                  {job?.jobRole}, {job?.company}
                </h2>
                <p className="text-sm opacity-70">{job?.applications.length} applicants</p>
              </div>

              <div className="flex flex-wrap justify-start md:justify-end gap-3">
                <button
                  onClick={() => openModal(job._id)}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-sm assistant text-white text-sm transition"
                >
                  Show Applicants
                </button>

                <NavLink to={`/update-job/${job._id}`}>
                  <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-sm assistant text-white text-sm transition">
                    Edit
                  </button>
                </NavLink>

                <button
                  onClick={() => deleteAnjob(job._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-sm assistant text-white text-sm transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center opacity-60 lato-regular">No jobs found.</p>
        )}
      </div>
    )}

    {/* Applied Jobs Section */}
    {activeSection === "applied" && (
      <div className="w-full px-4 sm:px-6 pb-6 grid grid-cols-1 gap-4">
        <h2 className="lato-regular text-xl sm:text-2xl">Jobs you have applied</h2>
        {appliedJobs?.length > 0 ? (
          appliedJobs.map((app) => (
            <div
              key={app._id}
              className={`flex flex-col gap-4 md:flex-row md:justify-between items-start md:items-center rounded-sm p-4 shadow-md transition-all ${
                mode ? "bg-[#1e1e1e] hover:bg-[#2a2a2a]" : "bg-white hover:bg-gray-50"
              }`}
            >
              <div>
                <h2 className="lato-regular text-base sm:text-lg">
                  {app?.job?.jobRole}, {app?.job?.company}
                </h2>
                <p className="text-sm opacity-70">
                  {app?.job?.location} | {app?.job?.type}
                </p>
              </div>

              <div className="text-sm lato-regular">
                Status:{" "}
                <span
                  className={app?.status === "Accepted" ? "text-emerald-500" : "text-red-500"}
                >
                  {app?.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center opacity-60 lato-regular">No jobs found.</p>
        )}
      </div>
    )}
  </div>

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 px-4">
      <div
        className={`relative rounded-lg shadow-xl p-6 w-full max-h-[90vh] max-w-2xl overflow-y-auto ${
          mode
            ? "bg-[#1e1e1e] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-300"
        }`}
      >
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="text-xl font-bold hover:text-red-500"
          >
            <RxCross1 />
          </button>
        </div>
        <Application jobId={selectedJobId} onStatusChange={fetchselectedJobs} />
      </div>
    </div>
  )}
</>


  );
};

export default ProfileJobs;
