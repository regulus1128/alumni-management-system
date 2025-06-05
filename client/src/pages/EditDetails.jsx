import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchUserProfile, updateUserProfile } from "../features/profileSlice.js";


const EditDetails = () => {
  const { user, role, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({});
  const navigate = useNavigate();
  

  const loadUserProfile = async () => {
    try {
      await dispatch(fetchUserProfile());
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    department: "",
    pursuing: "",
    batch: "",
    graduatedIn: "",
    jobRole: "",
    company: "",
    avatar: null,
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        phone: user.phone || "",
        dept: user.dept || "",
        pursuing: user.pursuing || "",
        batch: user.batch || "",
        graduatedIn: user.graduatedIn || "",
        jobRole: user.jobRole || "",
        company: user.company || "",
        avatar: null,
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(updateUserProfile(formData));
      // console.log(response.payload);
      if(response.payload.success){
        toast.success("Profile updated successfully!");
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div>
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 '>
    <div className='h-64'>

        <input type="text" name="name" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular' placeholder='Name' value={formData.name}
        onChange={handleInputChange} required/>

        <input type="email" name="email" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular' placeholder='Email' value={formData.email} onChange={handleInputChange} required/>


        <select name="gender" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular' value={formData.gender || ""} onChange={handleInputChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <select name="role" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular' value={role} onChange={handleInputChange}>
            <option value="Alumni">Alumni</option>
            <option value="CurrentStudent">Current Student</option>
        </select>

        {role === "student" && (
            <>
              <input
                type="text"
                placeholder="Department"
                name="dept"
                value={formData.dept || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
              <input
                type="text"
                placeholder="Pursuing"
                value={formData.pursuing || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
              <input
                type="number"
                placeholder="Batch"
                value={formData.batch || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
            </>
          )}

{role === "alumni" && (
            <>
              <input
                type="text"
                placeholder="Graduated In"
                value={formData.graduatedIn || ""}
                name="graduatedIn"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.dept || ""}
                name="dept"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
              <input
                type="text"
                placeholder="Job Role"
                value={formData.jobRole || ""}
                name="jobRole"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
              <input
                type="text"
                placeholder="Company/Organization"
                value={formData.company || ""}
                name="company"
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
              />
            </>
          )}

        <input type="tel" name="phone" id="" className='w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular' placeholder='Phone' value={formData.phone} onChange={handleInputChange} required/>

        <input
            class="w-full px-3 py-2 border border-neutral-500 rounded-sm mt-2 lato-regular"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            type="file"
            name="avatar"
            onChange={handleInputChange}
            placeholder='Upload Profile Picture'
          />

        
        
        <button className='bg-teal-500 text-white font-medium px-8 w-full py-2 mt-4 mb-4 rounded-sm cursor-pointer hover:bg-teal-600 assistant'>Update Details</button>
        

    </div>
</form>
    </div>
  )
}

export default EditDetails