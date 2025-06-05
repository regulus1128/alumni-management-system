import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobById } from "../features/jobSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Application = ({ jobId, onStatusChange }) => {
  const dispatch = useDispatch();
  const [applications, setApplications] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);

  const fetchJob = async () => {
    try {
      const res = await dispatch(fetchJobById(jobId));
      console.log(res.payload.job.applications);
      setApplications(res.payload.job.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await axios.put(
        `${backendUrl}/api/application/status/${applicationId}`,
        { status }
      );
      console.log(res);
      if (res.data.success) {
        setApplications((prev) =>
          prev.filter((application) => application._id !== applicationId)
        );
        toast.success(res.data.message);
        onStatusChange();
      }
      // fetchJob();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  return (
    <div>
      <div className={`w-full px-6 pb-6 grid grid-cols-1 gap-4 transition-colors duration-300 `}>
        <h2 className="lato-regular text-2xl">Applicants</h2>
        {applications?.length ? (
          applications?.map((application) => (
            <div
              key={application._id}
              className={`flex flex-col md:flex-row md:justify-between items-start md:items-center rounded-sm p-4 shadow-md hover:shadow-lg transition-all ${mode ? " text-white" : " text-gray-800"}`}
            >
              <div className="mb-4 md:mb-0">
                <h2 className="lato-regular text-lg">
                  {application.name}
                </h2>
                <p className="text-sm ">{application.email}</p>
                <p className="text-sm mt-1">
                  {application.contact}
                </p>
              </div>

              <div className="flex justify-around space-x-4">
                <button
                  onClick={() => updateStatus(application._id, "Accepted")}
                  className="px-4 py-2 bg-teal-500 rounded-4xl assistant text-white hover:bg-teal-600 cursor-pointer transition lato-regular"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(application._id, "Rejected")}
                  className="px-4 py-2 bg-red-500 rounded-4xl assistant text-white hover:bg-red-600 cursor-pointer transition lato-regular"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="lato-regular">No applicants for this job.</p>
        )}
      </div>
    </div>
  );
};

export default Application;
