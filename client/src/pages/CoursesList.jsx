import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const navigate = useNavigate();

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/course`, { withCredentials: true });
            console.log(res.data.courses);
            setCourses(res.data.courses);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCourses();
    }, []);

  return (
    <div>
      <div class="relative overflow-x-auto shadow-md rounded-sm">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-lg text-white uppercase bg-gray-500 assistant">
            <tr>
              <th scope="col" class="px-6 py-3">
                Title
              </th>
              <th scope="col" class="px-6 py-3">
                Code
              </th>
              <th scope="col" class="px-6 py-3">
                department
              </th>
              <th scope="col" class="px-6 py-3">
            
              </th>
              <th scope="col" class="px-6 py-3">
            
              </th>
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          {courses.length > 0 ? (
            <tbody className="lato-regular text-[15px]">
              {courses.map((course, index) => (
                <tr
                  key={index}
                  className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-black whitespace-nowrap"
                  >
                    {course.name}
                  </th>
                  <td className="px-6 py-4">{course.code}</td>
                  <td className="px-6 py-4">
                    {course.department}
                  </td>
                  <td className="px-6 py-4"></td>
                  <td className="px-6 py-4">
                    
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* <div className="flex items-center space-x-2">
                      <button
                        
                        className="w-[90px] py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-full text-sm font-semibold text-center cursor-pointer"
                      >
                        Edit
                      </button>

                      <button
                       
                      className="w-[90px] py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold text-center cursor-pointer">
                        Delete
                      </button>
                    </div> */}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No alumni found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
        
      </div>
      <div className='flex items-center mt-10'>
            <button onClick={() => navigate("/course-form")} className='px-3 py-2 bg-blue-500 cursor-pointer rounded-full text-white lato-regular'>ADD A COURSE</button>
        </div>
    </div>
  )
}

export default CoursesList