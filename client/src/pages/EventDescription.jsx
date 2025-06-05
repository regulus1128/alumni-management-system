import React, { useEffect, useRef, useState } from 'react'
import { IoLocationOutline } from "react-icons/io5";
import { CiCalendarDate } from "react-icons/ci";
import { IoIosPerson } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { getEventById } from '../features/eventSlice';
import { useParams } from 'react-router-dom';
import DOMPurify from "dompurify";
import { formatPostedDate } from '../utils/date';
import EventApplication from './EventApplication';
import { fetchUserProfile } from '../features/profileSlice';


const EventDescription = () => {
  const dispatch = useDispatch();
  const { selectedEvent, currentEvent, loading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.profile);
  const { id } = useParams();
  const formRef = useRef(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  console.log('current event', currentEvent);



  useEffect(() => {
    if (currentEvent && user?._id) {
      const userId = user._id;
  
      const isInAlumni = currentEvent.joinedAlumni?.some(entry => {
        return (
          entry.alumni === userId || 
          entry.alumni?._id === userId || 
          entry._id === userId  // fallback if alumni ID is stored as _id directly
        );
      });
  
      const isInStudents = currentEvent.joinedStudents?.some(entry => {
        return (
          entry.student === userId || 
          entry.student?._id === userId || 
          entry._id === userId  // fallback
        );
      });
  
      setHasJoined(isInAlumni || isInStudents);
    }
  }, [currentEvent, user]);
  
  

  const toggleApplicationForm = () => {
    setShowApplicationForm((prev) => {
      const newValue = !prev;
  
      // Delay scroll until after render
      if (!prev && formRef.current) {
        setTimeout(() => {
          formRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
  
      return newValue;
    });
  };

  const fetchSingleEvent = async (id) => {
    try {
      await dispatch(getEventById(id));
      // console.log(response.payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(id){
      fetchSingleEvent(id);
    }
  }, []);

  useEffect(() => {
    if(!user){
      dispatch(fetchUserProfile());
    }
  }, [dispatch, user])

  // console.log(user);

  if (loading || !currentEvent) {
    return <div className="text-center mt-10 text-lg">Loading event...</div>;
  }


  return (
    <div className='flex flex-col items-center w-full mt-5'>
        <div className="w-1/2 mt-5 flex flex-col lato-regular bg-white shadow-md hover:shadow-lg transition-shadow p-8 rounded-sm">
      <div class="w-full mx-auto mt-5">
        <div class="mb-3">
        <h1 className="assistant text-3xl mb-3">
            {currentEvent?.name}
        </h1>
        </div>

        <div class="mb-2 flex">
        <CiCalendarDate size={20} className="mt-1"/>
        <p className="lato-regular ml-2 mb-2 mt-0.5">
        {currentEvent?.dateTime ? formatPostedDate(currentEvent.dateTime) : "Date not available"}
        </p>
        </div>

        <div class="mb-2 flex">
        <IoLocationOutline size={20} className="mt-1" />
        <p className="lato-regular ml-2 mb-2 mt-0.5">
            {currentEvent?.location}
        </p>
        </div>

        <div class="mb-2 flex">
        <IoIosPerson size={20} className="mt-1" />
            <p className="lato-regular ml-2 mb-2 mt-0.5"> {currentEvent?.alumni?.name || currentEvent?.student?.name || "Unknown"}</p>
        </div>
    
        <div className="mb-5 mt-5">
        <h2 className='mb-4 text-xl font-bold'>Event Details:</h2>
        <div
                  className="lato-regular mt-2 text-sm md:text-base"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(currentEvent?.description),
                  }}
                />

        </div>

        
        
        <button
          type="submit"
          onClick={toggleApplicationForm}
          className={`text-white ${hasJoined ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'} w-full font-medium rounded-sm text-lg px-5 py-3 text-center assistant cursor-pointer transition`}
          disabled={hasJoined}
        >
          {hasJoined ? "You have already joined this event." : showApplicationForm ? "Hide Application Form" : "Join This Event"}
        </button>
      </div>
    </div>
    {showApplicationForm && <EventApplication />}
    </div>
  )
}

export default EventDescription