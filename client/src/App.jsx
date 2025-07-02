import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Alumni from './pages/Alumni'

import Forums from './pages/Forums'
import Jobs from './pages/Jobs'
import Login from './pages/Login'
import Register from './pages/Register'
import JobForm from './components/JobForm'
import ForumForm from './components/ForumForm'
import JobDescription from './pages/JobDescription'
import EventsTwo from './components/EventsTwo'
import EditDetails from './pages/EditDetails'
import Layout from './layouts/Layout'
import EventDescription from './pages/EventDescription'
import EventForm from './components/EventForm'
import UpdateEvent from './pages/UpdateEvent'
import ForumDescription from './pages/ForumDescription'
import ProfileLayout from './layouts/ProfileLayout'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatus } from './features/authSlice.js'
import UpdateJob from './pages/UpdateJob.jsx'
import UpdateForum from './pages/UpdateForum.jsx'
import JobApplication from './pages/JobApplication.jsx'
import Application from './pages/Application.jsx'
import EventJoined from './pages/EventJoined.jsx'
import Notifications from './pages/Notifications.jsx'
import CourseForm from './components/CourseForm.jsx'
import Courses from './pages/Courses.jsx'

const App = () => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // console.log(user);

  // Check the authentication status when the app loads
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  
  return (
    <div>
      <BrowserRouter>
      {user && <Navbar/>}
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/alumni' element={<Alumni/>}/>
        <Route path='/forums' element={<Forums/>}/>
        <Route path='/jobs' element={<Jobs/>}/>
        <Route path='/courses' element={<Courses/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/job-form' element={<JobForm/>}/>
        <Route path='/job-application/:id' element={<JobApplication/>}/>
        <Route path='/course-form' element={<CourseForm/>}/>
        <Route path='/forum-form' element={<ForumForm/>}/>
        <Route path='/forum-description/:id' element={<ForumDescription/>}/>
        <Route path='/job-description' element={<JobDescription/>}/>
        <Route path='/event-description/:id' element={<EventDescription/>}/>
        <Route path='/events' element={<EventsTwo/>}/>
        <Route path='/edit-details/:id' element={<EditDetails/>}/>
        <Route path='/notifications' element={<Notifications/>}/>


        <Route path='/dashboard' element={<Layout/>}/>
        <Route path='/dashboard/*' element={<Layout/>}/>
        <Route path='/post-event' element={<EventForm/>}/>
        <Route path='/update-event/:id' element={<UpdateEvent/>}/>
        <Route path='/update-job/:id' element={<UpdateJob/>}/>
        <Route path='/update-forum/:id' element={<UpdateForum/>}/>

        {/* layout for profile */}
        <Route path='/profile' element={<ProfileLayout/>}/>
        <Route path='/profile/*' element={<ProfileLayout/>}/>
        <Route path='/application/:id' element={<Application/>}/>
        <Route path='/joined/:id' element={<EventJoined/>}/>


      </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App