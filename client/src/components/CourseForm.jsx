import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from 'react-router-dom';


const CourseForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        department: "",
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendUrl}/api/course/add`, formData, { withCredentials: true });
            console.log(res);
            if(res.data.success){
                toast.success(res.data.message);
                navigate("/dashboard/courses-list");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
      {/* <Toaster/> */}
      <h1 className="assistant text-2xl">Fill course details</h1>
      <form onSubmit={handleSubmit} class="w-[30%] mx-auto mt-5">
        <div class="mb-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Course Title"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Course Code"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Department"
            required
          />
        </div>
    

        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant mb-10"
        >
          ADD COURSE
        </button>
      </form>
    </div>
  )
}

export default CourseForm