import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { deleteEvent, getEventsByUser } from "../features/eventSlice.js";
import toast from "react-hot-toast";
import EventJoined from "./EventJoined.jsx";
import { RxCross1 } from "react-icons/rx";
import { formatPostedDate } from "../utils/date.js";


const ProfileEvents = () => {
  const dispatch = useDispatch();
  const { selectedEvent } = useSelector((state) => state.events);
  const { mode } = useSelector((state) => state.darkMode);

  const { user, role } = useSelector((state) => state.profile);
  const [activeSection, setActiveSection] = useState("joined");
  const [showModal, setShowModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const openModal = (jobId) => {
    setSelectedEventId(jobId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEventId(null);
  };

  
  const fetchSelectedEvents = async () => {
    if (!user || !role) return;
    
    try {
      const res = await dispatch(getEventsByUser({ 
        role: role, 
        id: user._id 
      }))
      // console.log("events", res);
      // console.log(response);
    } catch (error) {
      console.log("Error fetching events:", error);
    }
  };

  const deleteAnEvent = async (id) => {
    try {
      await dispatch(deleteEvent(id));
      toast.success('Event deleted successfully!');
      fetchSelectedEvents();
    } catch (error) {
      console.log("Error deleting event:", error);
      toast.error('Failed to delete event');
    }
  }

  useEffect(() => {
    fetchSelectedEvents();
  }, [user, role]);

  // console.log('user evnts', user.joinedEvents)

  

  return (
    <div className={`w-full transition-colors duration-300 ${mode ? " text-white" : "text-gray-800"}`}>
  <div className="flex justify-center mb-6 gap-4">
    {["joined", "posted"].map((section) => (
      <button
        key={section}
        onClick={() => setActiveSection(section)}
        className={`px-6 py-2 rounded-sm font-medium lato-regular cursor-pointer ${
          activeSection === section
            ? "bg-teal-600 text-white"
            : `${mode ? "bg-[#2a2a2a] text-white" : "bg-gray-200 text-gray-700"}`
        } transition-colors duration-200`}
      >
        {section === "joined" ? "Joined Events" : "Posted Events"}
      </button>
    ))}
  </div>

  {/* Joined Events */}
  {activeSection === "joined" && (
    <div className="w-full mt-6 p-6 grid grid-cols-1 gap-4">
      <h2 className="lato-regular text-2xl">Events you have joined</h2>
      {user.joinedEvents?.length > 0 ? (
        user.joinedEvents.map((event) => (
          <div
            key={event._id}
            className={`rounded-sm p-4 shadow-md transition-all md:flex md:justify-between md:items-center ${
              mode ? "bg-[#1e1e1e] hover:bg-[#2a2a2a]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div>
              <h2 className="lato-regular text-lg">{event.name}</h2>
              <p className="text-sm">{event.location}</p>
              <p className="text-sm opacity-70">{formatPostedDate(event.dateTime)}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center opacity-60 lato-regular">No events found.</p>
      )}
    </div>
  )}

  {/* Posted Events */}
  {activeSection === "posted" && (
    <div className="w-full mt-6 p-6 grid grid-cols-1 gap-4">
      <h2 className="lato-regular text-2xl">Events you have posted</h2>
      {selectedEvent?.length > 0 ? (
        selectedEvent.map((event) => (
          <div
            key={event._id}
            className={`rounded-sm p-4 shadow-md transition-all md:flex md:justify-between md:items-center ${
              mode ? "bg-[#1e1e1e] hover:bg-[#2a2a2a]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <div>
              <h2 className="lato-regular text-lg">
                {event.name}, {event.location}
              </h2>
              <p className="text-sm opacity-70">
                {(event?.joinedAlumni?.length || 0) + (event?.joinedStudent?.length || 0)} people joined
              </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => openModal(event._id)}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white assistant rounded-sm"
              >
                Show Joined Members
              </button>
              <NavLink to={`/update-event/${event._id}`}>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white assistant rounded-sm">
                  Edit
                </button>
              </NavLink>
              <button
                onClick={() => deleteAnEvent(event._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white assistant rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center opacity-60 lato-regular">No events found.</p>
      )}
    </div>
  )}

  {/* Modal */}
  {showModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className={`relative rounded-lg shadow-xl p-6 max-h-[90vh] w-[90%] md:w-[50%] overflow-y-auto ${
        mode ? "bg-[#1e1e1e] text-white border border-gray-700" : "bg-white text-gray-800 border border-gray-300"
      }`}>
        <div className="flex justify-end">
          <button
            onClick={closeModal}
            className="text-xl font-bold hover:text-red-500"
          >
            <RxCross1 />
          </button>
        </div>
        <EventJoined eventId={selectedEventId} />
      </div>
    </div>
  )}
</div>

  );
};

export default ProfileEvents;