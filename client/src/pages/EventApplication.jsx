import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../features/profileSlice';

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;


const EventApplication = () => {
    const { id } = useParams();
    const { mode } = useSelector((state) => state.darkMode);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");

    const getUserProfile = async () => {
      try {
        const response = await dispatch(fetchUserProfile());
        const user = response.payload.user;
        // console.log("user profile: ", user);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || "",
        });
      } catch (error) {
        console.log(error);
      }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${backendUrl}/api/event/join-event/${id}`, formData, { withCredentials: true });
            // console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate(`/events`);
            } else if(res.data.success === false) {
                toast.error(res.data.message);
            } else {
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, []);



  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
  <form onSubmit={handleSubmit} className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] mx-auto mt-5">
    <div className="mb-5">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className={`shadow-xs border ${mode ? "text-white" : "text-[#121212]"} border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5`}
        placeholder="Name"
        required
      />
    </div>
    <div className="mb-5">
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className={`shadow-xs border border-gray-400 ${mode ? "text-white" : "text-[#121212]"} text-md rounded-sm block w-full p-2.5`}
        placeholder="Email"
        required
      />
    </div>
    <div className="mb-5">
      <input
        type="number"
        name="contact"
        value={formData.contact}
        onChange={handleChange}
        className={`shadow-xs border border-gray-400 ${mode ? "text-white" : "text-[#121212]"} text-md rounded-sm block w-full p-2.5`}
        placeholder="Contact Number"
        required
      />
    </div>
    <button
      type="submit"
      className="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant mb-10"
    >
      Join!
    </button>
  </form>
</div>

  )
}

export default EventApplication