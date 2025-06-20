import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlumni, fetchUserProfile } from "../features/profileSlice";
import axios from "axios";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Alumni = () => {
  const dispatch = useDispatch();
  const { alumni, loading, error, user } = useSelector(
    (state) => state.profile
  );
  const { mode } = useSelector((state) => state.darkMode);

  const [alumniList, setAlumniList] = useState([]);
  const [role, setRole] = useState("");
  const [sentRequests, setSentRequests] = useState(new Set());

  const fetchAlumniList = async () => {
    try {
      const response = await dispatch(fetchAlumni());
      // console.log('alumni list: ', response);
      if (response.payload.success) {
        setAlumniList(response.payload.alumni);
      } else {
        console.log("Error fetching alumni list");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await dispatch(fetchUserProfile());
      const user = response.payload;
      // console.log("user profile: ", user);
      setRole(user.role);
      fetchSentRequests(user.role, user.user._id);
    } catch (error) {
      console.log(error);
    }
  };

  const sendARequest = async (alumniId, studentId, connectedById) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/connection/request",
        { alumniId, studentId, connectedById },
        { withCredentials: true }
      );

      if (response.data.success) {
        setSentRequests((prev) => new Set(prev).add(alumniId));
        toast.success("Connection request sent!");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("Request already sent");
        toast.error("Request already sent");
        setSentRequests((prev) => new Set(prev).add(alumniId)); // still mark as sent
      } else {
        console.log(error);
      }
    }
  };

  const fetchSentRequests = async (role, userId) => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/connection/connection/${role}/${userId}`,
        {
          withCredentials: true,
        }
      );

      // console.log("sent req", res);
      // console.log("sent req", res.data.sentAlumniIds);

      if (res.data.success && Array.isArray(res.data.sentAlumniIds)) {
        const idSet = new Set(res.data.sentAlumniIds.map((a) => a._id));
        setSentRequests(idSet);
      }
    } catch (error) {
      console.error("Failed to fetch sent requests", error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  useEffect(() => {
    fetchAlumniList();
  }, []);

  // useEffect(() => {
  //   if (user && role) {
  //     fetchSentRequests(role, user._id);
  //   }
  // }, [user, role]);

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors duration-300 ${
        mode ? "bg-[#121212] text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Alumni info on cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-6">
        {alumniList.length > 0 ? (
          alumniList.map((alumnus) => {
            if (alumnus._id === user?._id) return null;

            return (
              <div
                key={alumnus._id}
                className={`rounded-sm shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 
              ${
                mode
                  ? "bg-[#1e1e1e] text-white border border-gray-700"
                  : "bg-white text-gray-800 border border-gray-100"
              }`}
              >
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 overflow-hidden border-2 ${
                        mode ? "border-gray-600" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={alumnus.avatar}
                        alt={`${alumnus.name}'s avatar`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 assistant">
                      {alumnus.name}
                    </h3>
                    <p
                      className={`text-sm mb-1 lato-regular ${
                        mode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {alumnus.jobRole} at {alumnus.company}
                    </p>
                    <p
                      className={`text-sm mb-4 lato-regular ${
                        mode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {alumnus.dept}
                    </p>

                    {!!user && (
                      <button
                        onClick={() => {
                          if (role === "alumni") {
                            sendARequest(alumnus._id, null, user?._id);
                          } else if (role === "student") {
                            sendARequest(alumnus._id, user?._id, null);
                          }
                        }}
                        disabled={sentRequests?.has(alumnus._id)}
                        className={`px-6 py-2 rounded-sm assistant transition-colors duration-200 
                      ${
                        sentRequests?.has(alumnus._id)
                          ? "bg-gray-500 cursor-not-allowed text-white"
                          : "bg-teal-500 hover:bg-teal-600 text-white"
                      }`}
                      >
                        {sentRequests?.has(alumnus._id) ? "Sent" : "Connect"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex justify-center">
            <p className="lato-regular text-gray-400">No alumni found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alumni;
