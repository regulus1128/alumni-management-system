import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineRoom } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from "../features/eventSlice";
import DOMPurify from "dompurify";
import { formatPostedDate } from "../utils/date";



const EventsTwo = () => {
  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const [fetchedEvents, setFetchedEvents] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);
  const { user } = useSelector((state) => state.auth);



  const fetchAllEvents = async () => {
    try {
      const response = await dispatch(getAllEvents());
      console.log('events here', response.payload.events);
      setFetchedEvents(response.payload.events);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);
  return (
    <div className={`min-h-screen ${mode ? 'bg-[#121212] text-white' : 'bg-white text-gray-800'} transition-colors duration-300`}>
  <div className="">
    {/* Post Event Button */}
    <div className="flex justify-center mb-10">
      {!!user && (<NavLink to="/post-event">
        <button className="bg-teal-500 px-3 py-2 mt-10 text-white rounded-sm assistant w-60 text-[18px] cursor-pointer hover:bg-teal-600 transition-all">
          POST AN EVENT
        </button>
      </NavLink>)}
      
    </div>

    {/* Events Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6 m-10">
      {fetchedEvents.map((event) => (
        <div
          key={event._id}
          className={`w-full h-[300px] rounded-sm p-5 shadow-md hover:shadow-lg transition-shadow ${
            mode ? 'bg-[#1f1f1f] text-white border border-gray-700' : 'bg-white text-gray-800'
          }`}
        >
          <h2 className="lato-regular mb-2 text-xl font-semibold truncate">
            {event.name}
          </h2>

          {/* Date */}
          <div className="flex items-center">
            <CiCalendarDate size={25} />
            <h2 className={`lato-regular mb-1 ml-2 ${mode ? 'text-gray-300' : 'text-gray-600'}`}>
              {formatPostedDate(event.dateTime)}
            </h2>
          </div>

          {/* Location */}
          <div className="flex items-center mt-1">
            <MdOutlineRoom size={25} />
            <h2 className={`lato-regular mb-1 ml-2 ${mode ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.location}
            </h2>
          </div>

          {/* Posted By */}
          <div className="flex items-center mt-1">
            <IoIosPerson size={25} />
            <h2 className={`lato-regular mb-1 ml-2 ${mode ? 'text-gray-300' : 'text-gray-600'}`}>
              {event.alumni?.name || event.student?.name}
            </h2>
          </div>

          {/* Description (clamped) */}
          <div
            className={`lato-regular mt-2 text-sm md:text-base ${mode ? 'text-gray-400' : 'text-gray-700'}`}
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event.description),
            }}
          />

          {/* Read More Button */}
          <div className="flex mt-10 justify-center w-full">
            <NavLink to={`/event-description/${event._id}`}>
              <button className="bg-teal-500 px-2 py-2 text-white rounded-sm assistant cursor-pointer hover:bg-teal-600 w-48 transition-all">
                Read More
              </button>
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default EventsTwo;
