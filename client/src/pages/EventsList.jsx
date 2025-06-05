import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { formatPostedDate } from '../utils/date';
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const EventsList = () => {

  const [event, setEvent] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/events`, { withCredentials: true });
      // console.log(res.data.events);
      if(res.data.success){
        setEvent(res.data.events); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/delete-event/${id}`, { withCredentials: true });
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchEvents();
      }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md rounded-sm">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-lg text-white uppercase bg-gray-500 assistant">
            <tr>
              <th scope="col" class="px-6 py-3">
                event name
              </th>
              <th scope="col" class="px-6 py-3">
                location
              </th>
              <th scope="col" class="px-6 py-3">
                Posted by
              </th>             
              <th scope="col" class="px-6 py-3">
                Date and time
              </th>
              <th scope="col" class="px-6 py-3"></th>

              
            </tr>
          </thead>
          {event.length > 0 ? (
  <tbody className="lato-regular text-[15px]">
    {event.map((ev, index) => (
      <tr
        key={ev._id || index}
        className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-black whitespace-nowrap"
        >
          {ev.name}
        </th>
        {/* <td className="px-6 py-4">{ev.evRole}</td> */}
        <td className="px-6 py-4">{ev.location}</td>
        <td className="px-6 py-4">{ev.alumni.name || ev.student.name}</td>
        <td className="px-6 py-4">{formatPostedDate(ev.dateTime)}</td>
        
        <td className="px-6 py-4 text-right">
          
          <button onClick={() => handleDelete(event._id)} className="px-3 py-2 ml-2 w-[70px] bg-red-500 hover:bg-red-600 cursor-pointer rounded-full text-white">
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
) : (
  <tbody>
    <tr>
      <td colSpan="5" className="text-center py-4 text-gray-500">
        No events found.
      </td>
    </tr>
  </tbody>
)}

          
        </table>
      </div>
    </div>
  )
}

export default EventsList