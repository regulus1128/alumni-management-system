import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../features/profileSlice.js";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user, role, loading, error } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({});
  const { mode } = useSelector((state) => state.darkMode);


  const loadUserProfile = async () => {
    try {
      const response = await dispatch(fetchUserProfile());
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };



  useEffect(() => {
    loadUserProfile();
  }, []);

  if (loading) return <div className="lato-regular text-center mt-4">Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className={`flex min-h-screen flex-col justify-center items-center `}>
  <div className={`border flex flex-col items-center h-76 rounded-sm w-full transition-colors duration-300 
    ${mode ? "bg-[#1e1e1e] border-gray-700 text-white" : " border-gray-300 text-gray-800"}`}>
    
    <img src={user?.avatar} className="w-36 mt-4 rounded-full" alt="" />
    <h2 className="text-3xl mt-4 assistant">{user?.name}</h2>

    {role === "alumni" ? (
      <p className="text-xl mt-4 lato-regular">
        {user?.jobRole?.trim() && user?.company?.trim()
  ? `${user.jobRole} at ${user.company}`
  : "Currently not employed"} 
      </p>
    ) : (
      <p className="text-xl mt-4 lato-regular">Student</p>
    )}

    <div className="flex justify-center mt-3">
      <h2 className="text-lg lato-regular">
        Status:{" "}
        <span className={user?.verified ? "text-green-500" : "text-red-500"}>
          {user?.verified ? "Verified" : "Not Verified"}
        </span>
      </h2>
    </div>
  </div>

  <div className={`rounded-sm w-full mt-10 transition-colors duration-300 
    ${mode ? "bg-[#2a2a2a] text-white" : "bg-[#f1efef] text-gray-800"}`}>
    
    <div className="flex justify-between">
      <h2 className="text-3xl mt-4 ml-6 assistant">Personal Info</h2>
      <div className="flex justify-center">
        <NavLink to={`/edit-details/${user?._id}`}>
          <button className="mr-6 px-5 py-2 mt-4 bg-teal-500 text-white rounded-sm assistant cursor-pointer hover:bg-teal-600">
            Edit Details
          </button>
        </NavLink>
      </div>
    </div>

    <div className="w-full mt-6">
      {[
        { label: "Name", value: user?.name },
        { label: "Email", value: user?.email },
        { label: "Department", value: user?.dept },
        { label: "Gender", value: user?.gender },
        ...(role === "student" ? [
          { label: "Batch", value: user?.batch },
          { label: "Pursuing", value: user?.pursuing }
        ] : []),
        ...(role === "alumni" ? [
          { label: "Graduated In", value: user?.graduatedIn },
          { label: "Job Role", value: user?.jobRole },
          { label: "Company", value: user?.company }
        ] : []),
        { label: "Phone", value: user?.phone },
      ].map(({ label, value }, idx) => (
        <div key={label}>
          <div className="flex justify-between pl-6 pr-6 pt-2 pb-2 mb-2">
            <h2 className="mt-1 lato-regular">
              <span className="font-bold">{label}:</span> {value}
            </h2>
          </div>
          {idx < 7 && <hr className={`${mode ? "border-gray-700" : "border-gray-400"} w-[96.5%] mx-auto`} />}
        </div>
      ))}
    </div>
  </div>
</div>

    </>
  );
};

export default Profile;
