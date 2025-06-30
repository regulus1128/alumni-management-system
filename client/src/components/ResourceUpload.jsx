import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;


const ResourceUpload = ({ courseId, onClose }) => {

    // const { courseId } = useParams();
    const { mode } = useSelector((state) => state.darkMode);
    const [resourceFile, setResourceFile] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "",
    });


    const handleFileChange = (e) => {
        setResourceFile(e.target.files[0]);
      };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submission = new FormData();
        submission.append("title", formData.title);
        submission.append("type", formData.type);

        if (resourceFile) {
            submission.append("resource", resourceFile);
        }

        try {
            const res = await axios.post(`${backendUrl}/api/resource/upload/${courseId}`, submission, { withCredentials: true });
            // console.log(res);
            if(res.data.success){
                toast.success(res.data.message);
                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    }

    
  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
      {/* <Toaster/> */}
      {/* <h1 className="assistant text-2xl">Fill your details</h1> */}
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        required
        className="w-full p-2 border border-gray-400 rounded-sm"
      />
      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
        className={`w-full p-2 border border-gray-400 rounded-sm ${
            mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"
          } text-gray-800`}
      >
        <option value="">Select Type</option>
        <option value="syllabus">Syllabus</option>
        <option value="notes">Notes</option>
        <option value="question paper">Question Paper</option>
        <option value="others">Others</option>
      </select>
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx"
        required
        className="w-full p-2 border border-gray-400 rounded-sm"
      />
      <button
        type="submit"
        className="bg-blue-500 w-full cursor-pointer py-2 rounded-sm text-white hover:bg-blue-600"
      >
        Upload
      </button>
    </form>
    </div>
  )
}

export default ResourceUpload