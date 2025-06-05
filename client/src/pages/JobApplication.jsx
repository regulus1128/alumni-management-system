import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const JobApplication = () => {

    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        reason: "",
        
    });

    const [resumeFile, setResumeFile] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submission = new FormData();
        submission.append("name", formData.name);
        submission.append("email", formData.email);
        submission.append("contact", formData.contact);
        submission.append("reason", formData.reason);

        if (resumeFile) {
            submission.append("resume", resumeFile);
        }

        try {
            const response = await axios.post(`${backendUrl}/api/job/apply/${id}`, submission, { withCredentials: true });
            console.log(response);
            if(response.data.success){
                toast.success(response.data.message);
                navigate("/jobs");
                
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to submit application");
        }
    }

  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
      {/* <Toaster/> */}
      <h1 className="assistant text-2xl">Fill your details</h1>
      <form onSubmit={handleSubmit} class="w-[30%] mx-auto mt-5">
        <div class="mb-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Name"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Email"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Contact Number"
            required
          />
        </div>
        <div className="mb-5">
        <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Upload Your Resume"
            required
          />
        </div>
        <div className="mb-5">
        <textarea
            rows={10}
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t resize-none"
            placeholder="Why do you want to join this company?"
            required
          />
        </div>
        

        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant mb-10"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default JobApplication;
