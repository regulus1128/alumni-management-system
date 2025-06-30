import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "../features/profileSlice.js";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createOrFetchConversation } from "../features/chatSlice.js";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;
const ProfileConnections = () => {
  const { user, role, loading, error } = useSelector((state) => state.profile);
  const { mode } = useSelector((state) => state.darkMode);
  const dispatch = useDispatch();
  const [connectionsReceived, setConnectionsReceived] = useState([]);
  const [connectionsSent, setConnectionsSent] = useState([]);
  const [activeSection, setActiveSection] = useState("received");
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const navigate = useNavigate();

  const loadUserProfile = async () => {
    try {
      const response = await dispatch(fetchUserProfile());
      // console.log("response in profile connections: ", response);
      const userRole = response.payload.role;
      const userId = response.payload.user._id;
      fetchSentConnections(userRole, userId);
      fetchAcceptedConnections(userId);
    } catch (error) {
      console.log(error);
    }
  };

  const respondToConnection = async (connectionId, status) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/connection/status/${connectionId}`,
        { status },
        { withCredentials: true }
      );

      const updatedConnection = response.data.connection;

      if (status === "accepted") {
        // Move to acceptedConnections
        setAcceptedConnections((prev) => [...prev, updatedConnection]);
        toast.success(response.data.message);
      } else if (status === "rejected") {
        toast.error(response.data.message);
      }

      // Remove from received connections regardless of action
      setConnectionsReceived((prev) =>
        prev.filter((conn) => conn._id !== connectionId)
      );
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const fetchReceivedConnections = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/connection/connection/${user?._id}`,
        { withCredentials: true }
      );
      // console.log('received connections: ', response.data.connections);
      setConnectionsReceived(response.data.connections);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSentConnections = async (role, userId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/connection/connection/${role}/${userId}`,
        { withCredentials: true }
      );
      // console.log('fetch sent: ', response.data.connections);
      setConnectionsSent(response.data.connections);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAcceptedConnections = async (userId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/connection/accepted-connections/${userId}`,
        { withCredentials: true }
      );
      console.log("accepted conns:", response.data.connections);
      setAcceptedConnections(response.data.connections);
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleStartChat = async (receiver) => {
    const recipientId = receiver._id;
    const recipientRole = receiver.pursuing ? "student" : "alumni"; // crude check
  
    try {
      const convo = await dispatch(createOrFetchConversation({ recipientId, recipientRole })).unwrap();
      navigate(`/profile/chats/${recipientId}`);
    } catch (err) {
      console.error("Failed to create or get conversation", err);
    }
  };

  useEffect(() => {
    if (role === "alumni") {
      fetchReceivedConnections();
    }
  }, [role]);

  useEffect(() => {
    if (role && user?.id) {
      fetchSentConnections();
    }
  }, [role, user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchAcceptedConnections();
    }
  }, [user?.id]);

  return (
    <div className={`w-full px-4 md:px-10 mt-10 transition-colors duration-300 ${mode ? " text-white" : " text-gray-800"}`}>
  {/* Section Tabs */}
  <div className="flex justify-center mb-6 gap-4">
    {["received", "sent", "accepted"].map((section) => (
      <button
        key={section}
        onClick={() => setActiveSection(section)}
        className={`px-6 py-2 rounded-sm font-medium lato-regular cursor-pointer ${
          activeSection === section
            ? "bg-teal-600 text-white"
            : `${mode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-700"}`
        } transition-colors duration-200`}
      >
        {section === "received"
          ? "Received Connections"
          : section === "sent"
          ? "Sent Connections"
          : "Your Connections"}
      </button>
    ))}
  </div>

  {/* Section content wrapper */}
  <div className={`${mode ? "bg-[#1e1e1e]" : "bg-[#f1efef]"} rounded-sm w-full p-6`}>
    {/* Received Connections */}
    {activeSection === "received" && (
      connectionsReceived.length === 0 ? (
        <p className="text-gray-400 text-center lato-regular">No received connections.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {connectionsReceived.map((connection) => {
            const initiator = connection.connectedById || connection.studentId;
            return (
              <div key={connection._id} className={`${mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"} p-5 rounded-lg shadow-md hover:shadow-xl transition-all flex flex-col items-center text-center`}>
                <img src={initiator?.avatar} alt={initiator?.name} className="w-20 h-20 rounded-full object-cover mb-4" />
                <h3 className="text-lg font-semibold lato-regular">{initiator?.name}</h3>
                {connection.connectedById ? (
                  <>
                    <p className="text-sm text-gray-400 lato-regular">{initiator.jobRole}</p>
                    <p className="text-sm text-gray-400 lato-regular">{initiator.company}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400 lato-regular">{initiator.dept}</p>
                    <p className="text-sm text-gray-400 lato-regular">{initiator.pursuing} - Batch {initiator.batch}</p>
                  </>
                )}
                <div className="flex w-full justify-around mt-3">
                  <button onClick={() => respondToConnection(connection._id, "accepted")} className="px-2 py-1 bg-teal-500 hover:bg-teal-600 rounded-sm assistant text-white">Accept</button>
                  <button onClick={() => respondToConnection(connection._id, "rejected")} className="px-2 py-1 bg-rose-500 hover:bg-rose-600 rounded-sm assistant text-white">Reject</button>
                </div>
              </div>
            );
          })}
        </div>
      )
    )}

    {/* Sent Connections */}
    {activeSection === "sent" && (
      connectionsSent.length === 0 ? (
        <p className="text-gray-400 text-center lato-regular">No sent connections.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {connectionsSent.map((connection) => (
            <div key={connection._id} className={`${mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"} p-5 rounded-lg shadow-md hover:shadow-xl flex flex-col items-center text-center`}>
              <img src={connection.alumniId.avatar} alt="name" className="w-20 h-20 rounded-full object-cover mb-4" />
              <h3 className="text-lg font-semibold lato-regular">{connection.alumniId.name}</h3>
              <p className="text-sm text-gray-400 lato-regular">{connection.alumniId.role}</p>
              <p className="text-sm text-gray-400 lato-regular">{connection.alumniId.dept} Dept.</p>
              <span className="mt-3 px-2 py-1 bg-teal-500 text-white rounded-sm assistant">
                {connection.status.charAt(0).toUpperCase() + connection.status.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      )
    )}

    {/* Accepted Connections */}
    {activeSection === "accepted" && (
      <>
        <h2 className="text-2xl font-semibold mb-4 assistant">{acceptedConnections.length} Connections</h2>
        {acceptedConnections.length === 0 ? (
          <p className="text-center text-gray-400 lato-regular">No accepted connections yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {acceptedConnections.map((connection) => {
              const initiator = connection.connectedById || connection.studentId;
              return (
                <div key={connection._id} className={`${mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"} p-5 rounded-lg shadow-md hover:shadow-xl flex flex-col items-center text-center`}>
                  <img src={initiator?.avatar} alt="name" className="w-20 h-20 rounded-full object-cover mb-4" />
                  <h3 className="text-lg font-semibold lato-regular">{initiator?.name}</h3>
                  {connection.connectedById ? (
                    <>
                      <p className="text-sm text-gray-400 lato-regular">{initiator.jobRole}</p>
                      <p className="text-sm text-gray-400 lato-regular">{initiator.company}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 lato-regular">{initiator.dept}</p>
                      <p className="text-sm text-gray-400 lato-regular">{initiator.pursuing} - Batch {initiator.batch}</p>
                    </>
                  )}
                  <div className="mt-2">
                    <button onClick={() => handleStartChat(initiator)} className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-sm cursor-pointer">
                      Message
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
</div>

  );
};

export default ProfileConnections;
