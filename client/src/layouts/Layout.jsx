import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet, Route, Routes } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import AlumniList from '../pages/AlumniList'
import EventsList from '../pages/EventsList'
import ForumsList from '../pages/ForumsList'
import JobList from '../pages/JobList'
import StudentList from '../pages/StudentList'
import CoursesList from '../pages/CoursesList'
import CourseForm from '../components/CourseForm'
import { useSelector } from 'react-redux'

const Layout = () => {
  const { mode } = useSelector((state) => state.darkMode);
  return (
    <div className="flex min-h-screen">
        <Sidebar/>
        <div className={`flex-grow p-8 ${mode ? "bg-[#121212] text-gray-100" : "bg-[#f3f3f3] text-gray-700"}`}>
            <Routes>
                <Route path='/' element={<Dashboard/>}/>
                <Route path='alumni-list' element={<AlumniList/>}/>
                <Route path='student-list' element={<StudentList/>}/>
                <Route path='/events-list' element={<EventsList/>}/>
                <Route path='/forums-list' element={<ForumsList/>}/>
                <Route path='/job-list' element={<JobList/>}/>
                <Route path='/courses-list' element={<CoursesList/>}/>
                <Route path='/course-form' element={<CourseForm/>}/>
            </Routes>
        </div>
    </div>
  )
}

export default Layout