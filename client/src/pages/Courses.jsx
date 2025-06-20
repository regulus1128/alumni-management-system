import React, { useEffect, useState } from 'react'
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import { useSelector } from 'react-redux';
import ResourceUpload from '../components/ResourceUpload';
import Resources from '../components/Resources';
import { RxCross1 } from "react-icons/rx";



const Courses = () => {
    const [courses, setCourses] = useState([]);
    const { mode } = useSelector((state) => state.darkMode);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [showResourcesPopup, setShowResourcesPopup] = useState(false);

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/course`, { withCredentials: true });
            // console.log(res.data.courses);
            setCourses(res.data.courses);
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenUpload = (courseId) => {
      setSelectedCourseId(courseId);
      setShowUploadPopup(true);
    };
  
    const handleCloseUpload = () => {
      setShowUploadPopup(false);
      setSelectedCourseId(null);
    };

    const handleOpenResources = (courseId) => {
      setSelectedCourseId(courseId);
      setShowResourcesPopup(true);
    };
    
    const handleCloseResources = () => {
      setShowResourcesPopup(false);
      setSelectedCourseId(null);
    };

    useEffect(() => {
        fetchCourses();
    }, []);

  return (
    <div
      className={`w-full min-h-screen px-6 py-10 transition-colors duration-300 ${
        mode ? "bg-[#121212] text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <h1 className="text-3xl font-bold mb-10 text-center text-teal-500 assistant">
        COURSE LIST
      </h1>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lato-regular">
          {courses.map((course) => (
            <div
              key={course._id}
              className={`p-5 rounded-md border shadow-md hover:shadow-lg transition-all duration-200 ${
                mode
                  ? "bg-[#1e1e1e] border-gray-700 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{course.name}</h2>
              <p className="text-sm mb-1">
                <span className="font-medium">Code:</span> {course.code}
              </p>
              <p className="text-sm">
                <span className="font-medium">Department:</span>{" "}
                {course.department}
              </p>
              <div className={`flex justify-around mt-5 ${
                mode
                  ? "text-white"
                  : "text-white"
              }`}>
              <button onClick={() => handleOpenUpload(course._id)} className='bg-blue-500 rounded-sm px-3 py-2 cursor-pointer hover:bg-blue-600'>Upload Resources</button>
              <button onClick={() => handleOpenResources(course._id)} className='bg-teal-500 rounded-sm px-3 py-2 cursor-pointer hover:bg-teal-600'>Show Resources</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No courses available yet.</p>
      )}

{showUploadPopup && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm`}>
          <div className={`w-[90%] max-w-lg rounded-md shadow-lg p-6 relative ${
            mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"
          }`}>
            <button
              onClick={handleCloseUpload}
              className="absolute top-4 right-6 cursor-pointer hover:text-red-500"
            >
              <RxCross1 />
            </button>
            <h2 className="text-xl assistant font-semibold mb-4">Upload a Resource</h2>
            <ResourceUpload courseId={selectedCourseId} onClose={handleCloseUpload} />
          </div>
        </div>
      )}

{showResourcesPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
    <div className={`w-[90%] max-w-lg rounded-md shadow-lg p-6 relative ${
      mode ? "bg-[#2a2a2a] text-white" : "bg-white text-gray-800"
    }`}>
      <button
        onClick={handleCloseResources}
        className="absolute top-4 right-6 cursor-pointer hover:text-red-500"
      >
        <RxCross1 />
      </button>
      <h2 className="text-xl assistant font-semibold mb-4">Available Resources</h2>
      <Resources courseId={selectedCourseId} onClose={handleCloseResources} />
    </div>
  </div>
)}
    </div>
  )
}

export default Courses