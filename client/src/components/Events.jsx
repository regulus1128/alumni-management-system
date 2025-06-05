import React, { useEffect, useState } from 'react'
import { CiCalendarDate } from "react-icons/ci";
import { MdOutlineRoom } from "react-icons/md";
import { IoIosPerson } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getAllEvents } from '../features/eventSlice';
import { formatPostedDate } from '../utils/date';
import DOMPurify from "dompurify";


const Events = () => {

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.events);
  const [events, setEvents] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);


  const fetchAllEvents = async () => {
    try {
      const response = await dispatch(getAllEvents());
      // console.log(response.payload.events);
      setEvents(response.payload.events);
    } catch (error) {
      console.log(error);
    }
  }

  // console.log('events', events.payload);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  return (
    <>
        <div className='m-10'>
            <h1 className='text-center mt-5 mb-10 text-4xl assistant'>UPCOMING EVENTS</h1>
            <div className='grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-6'>
            {events && events.length > 0 ? (
        events.map((event) => (
          <div 
            key={event._id} 
            className="w-full h-64 rounded-sm p-4 shadow-md hover:shadow-lg transition-shadow bg-white lato-regular"
          >
            <h2 className="mb-2 text-xl font-semibold truncate">
              {event.name}
            </h2>
            <div className="flex">
              <CiCalendarDate size={25} />
              <h2 className="mb-1 ml-2 text-gray-600">
                {formatPostedDate(event.dateTime)}
              </h2>
            </div>
            <div className="flex mt-1">
              <MdOutlineRoom size={25}/>
              <h2 className="mb-1 ml-2 text-gray-600">
                {event.location}
              </h2>
            </div>
            <div className="flex mt-1">
              <IoIosPerson size={25}/>
              <h2 className="mb-1 ml-2 text-gray-600">
                {event.alumni?.name || event.student?.name}
              </h2>
            </div>
            <p className="mt-2 text-gray-700 line-clamp-2"
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(event.description),
            }}>
              
            </p>
            {/* <div className="flex justify-between mt-4">
              <a href={`/event-description/${event._id}`}>
                <button className="bg-teal-500 px-2 py-2 text-white rounded-sm w-32 cursor-pointer hover:bg-teal-600">
                  Read More
                </button>
              </a>
            </div> */}
          </div>
        ))
      ) : (
        <div className="w-full p-4 text-center text-gray-600">No events found</div>
      )}
            

               

                
            </div>
        </div>
        
    </>
  )
}

export default Events