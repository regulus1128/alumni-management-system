import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { formatPostedDate } from '../utils/date';
import toast from "react-hot-toast";
import { useSelector } from 'react-redux';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ForumsList = () => {

  const [forums, setForums] = useState([]);
  const { mode } = useSelector((state) => state.darkMode);

  const fetchForums = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/forums`, { withCredentials: true });
      // console.log(res.data.forums);
      if(res.data.success){
        setForums(res.data.forums); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/delete-forum/${id}`, { withCredentials: true });
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
    fetchForums();
  }, []);
  return (
    <div>
         <div class="relative overflow-x-auto shadow-md rounded-sm">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-lg text-white uppercase bg-gray-500 assistant">
            <tr>
              <th scope="col" class="px-6 py-3">
                title
              </th>
              
              <th scope="col" class="px-6 py-3">
                Posted by
              </th>             
              <th scope="col" class="px-6 py-3">
                posted at
              </th>
              <th scope="col" class="px-6 py-3"></th>

              
            </tr>
          </thead>
          {forums.length > 0 ? (
  <tbody className="lato-regular text-[15px]">
    {forums.map((forum, index) => (
      <tr
        key={forum._id || index}
        className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
      >
        <th
          scope="row"
          className="px-6 py-4 font-medium text-black whitespace-nowrap"
        >
          {forum.title}
        </th>
        {/* <td className="px-6 py-4">{ev.evRole}</td> */}
        {/* <td className="px-6 py-4">{forum.location}</td> */}
        <td className="px-6 py-4">{forum.alumni?.name || forum.student?.name}</td>
        <td className="px-6 py-4">{formatPostedDate(forum.createdAt)}</td>
        
        <td className="px-6 py-4 text-right">
          
          <button onClick={() => handleDelete(forum._id)} className="px-3 py-2 ml-2 w-[70px] bg-red-500 hover:bg-red-600 cursor-pointer rounded-full text-white">
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
        No forums found.
      </td>
    </tr>
  </tbody>
)}

          
        </table>
      </div>
    </div>
  )
}

export default ForumsList