import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getEventById } from '../features/eventSlice';
import { useParams } from 'react-router-dom';

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

const EventJoined = ({ eventId }) => {

    const dispatch = useDispatch();
    const { id } = useParams();
    const [joinedAlumni, setJoinedAlumni] = useState([]);
    const [joinedStudents, setJoinedStudents] = useState([]);

    const fetchEvent = async () => {
        try {
            const res = await dispatch(getEventById(eventId));
            // console.log(res.payload.event);
            if(res.payload.success) {
                setJoinedAlumni(res.payload.event.joinedAlumni);
                setJoinedStudents(res.payload.event.joinedStudents);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchEvent();
    }, [id]);
    return (
    <div>
        <div className="w-full px-6 pb-6 grid grid-cols-1 gap-4">
            <h2 className="lato-regular text-2xl">Joined Alumni</h2>
            {joinedAlumni?.length ? (
                joinedAlumni?.map((alumni) => (
                    <div
                        key={alumni._id}
                        className="bg-white flex flex-col md:flex-row md:justify-between items-start md:items-center rounded-sm p-4 shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                    >
                        <div className="mb-4 md:mb-0">
                            <h2 className="lato-regular text-lg text-gray-800">{alumni.name}</h2>
                            <p className="text-sm text-gray-600">{alumni.email}</p>
                            <p className="text-sm text-gray-600">{alumni.contact}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className='text-gray-500 lato-regular'>No alumni have joined this event yet.</p>
            )}
        </div>

        <div className="w-full px-6 pb-6 grid grid-cols-1 gap-4">
            <h2 className="lato-regular text-2xl">Joined Students</h2>
            {joinedStudents?.length ? (
                joinedStudents?.map((student) => (
                    <div
                        key={student._id}
                        className="bg-white flex flex-col md:flex-row md:justify-between items-start md:items-center rounded-sm p-4 shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                    >
                        <div className="mb-4 md:mb-0">
                            <h2 className="lato-regular text-lg text-gray-800">{student.name}</h2>
                            <p className="text-sm text-gray-600">{student.email}</p>
                            <p className="text-sm text-gray-600">{student.contact}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className='text-gray-500 lato-regular'>No students have joined this event yet.</p>
            )}
        </div>
    </div>
  )
}

export default EventJoined