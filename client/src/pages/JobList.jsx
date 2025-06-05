import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const JobList = () => {

  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/jobs`, { withCredentials: true });
      console.log(res.data.jobs);
      if(res.data.success){
        setJobs(res.data.jobs); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/delete-job/${id}`, { withCredentials: true });
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchJobs();
      }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [])
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md rounded-sm">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-lg text-white uppercase bg-gray-500 assistant">
            <tr>
              <th scope="col" class="px-6 py-3">
                Company
              </th>
              <th scope="col" class="px-6 py-3">
                Role
              </th>
              <th scope="col" class="px-6 py-3">
                location
              </th>
              <th scope="col" class="px-6 py-3">
                Posted by
              </th>
              
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          {jobs.length > 0 ? (
  <tbody className="lato-regular text-[15px]">
    {jobs.map((job, index) => (
      <tr
        key={job._id || index}
        className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-black whitespace-nowrap"
        >
          {job.company}
        </th>
        <td className="px-6 py-4">{job.jobRole}</td>
        <td className="px-6 py-4">{job.location}</td>
        <td className="px-6 py-4">{job.postedBy?.name}</td>
        
        <td className="px-6 py-4 text-right">
          
          <button onClick={() => handleDelete(job._id)} className="px-3 py-2 ml-2 w-[70px] bg-red-500 hover:bg-red-600 cursor-pointer rounded-full text-white">
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
) : (
  <tbody>
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">
        No job found.
      </td>
    </tr>
  </tbody>
)}

          
        </table>
      </div>
    </div>
  );
};

export default JobList;
