import Alumni from "../models/alumni.model.js";
import Event from "../models/event.model.js";
import Notification from "../models/notification.model.js";
import Student from "../models/student.model.js";
import mongoose from "mongoose";


const postEvent = async (req, res) => {
    try {
      const { name, description, date, time, location } = req.body;
      const { _id, role } = req.user;
  
      if (!name || !description || !date || !time || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const dateTime = new Date(`${date}T${time}`);

      if (isNaN(dateTime.getTime())) {
        return res.status(400).json({ message: "Invalid date or time format" });
      }
  
      const newEvent = await Event.create({
        name,
        description,
        dateTime,
        location,
        ...(role === "student" ? { student: _id } : { alumni: _id }),  
      });

      if (role === "student") {
        await Student.findByIdAndUpdate(_id, {
          $push: { events: newEvent._id },
        });
      } else {
        await Alumni.findByIdAndUpdate(_id, {
          $push: { events: newEvent._id },
        });
      }
  
      return res.status(201).json({ message: "Event posted successfully!", event: newEvent });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  
  

  const getAllEvents = async (req, res) => {
    try {
      const events = await Event.find().populate('alumni', 'name').populate('student', 'name');
  
      res.status(200).json({ success: true, events });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const getEventById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const event = await Event.findById(id)
      .populate('alumni', 'name')
      .populate('student', 'name')  
      .populate('joinedAlumni.alumni', '_id name')
      .populate('joinedStudents.student', '_id name');
        
  
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      res.status(200).json({ success: true, event });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

  const editEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, date, time, location } = req.body;
  
      if (!name || !description || !date || !time || !location) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Combine date + time into one ISO string
      const dateTime = new Date(`${date}T${time}`);
  
      const updatedEvent = await Event.findByIdAndUpdate(
        id,
        {
          name,
          description,
          location,
          dateTime,
        },
        { new: true }
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json({ success: true, message: "Event updated successfully!", event: updatedEvent });
    } catch (error) {
      console.log("Edit Event Error:", error);
      res.status(500).json({ message: error.message });
    }
  };
  
  

  const deleteEvent = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedEvent = await Event.findByIdAndDelete(id);
  
      if (!deletedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }
  
      res.status(200).json({ message: "Event deleted successfully!", event: deletedEvent });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };
  

export const getEventsByUser = async (req, res) => {
    try {
      const { id, role } = req.params;
      let events;
  
      if (role === 'student') {
        events = await Event.find({ student: id })
          .populate('alumni', 'name')
          .populate('student', 'name');
      } else if (role === 'alumni') {
        events = await Event.find({ alumni: id })
          .populate('alumni', 'name')
          .populate('student', 'name');
      } else {
        return res.status(400).json({ error: 'Invalid role specified' });
      }
  
      res.status(200).json({ success: true, events });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  };

  export const joinEvent = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, contact } = req.body;
      const userId = req.user._id;
      const userRole = req.user.role;
      const event = await Event.findById(id);

      if(!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
      }

      if (
      (userRole === "alumni" && event.alumni?.toString() === userId) ||
      (userRole === "student" && event.student?.toString() === userId)
      ) {
      return res.status(400).json({
        success: false,
        message: "You cannot join your own event",
      });
      }

    const alreadyJoined = userRole === "student"
    ? event.joinedStudents.some(entry => entry.student.toString() === userId)
    : event.joinedAlumni.some(entry => entry.alumni.toString() === userId);

    if (alreadyJoined) {
      return res.status(400).json({
      success: false,
      message: "You have already joined this event",
    });
  }

    const eventObjectId = new mongoose.Types.ObjectId(id);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (userRole === "student") {
      event.joinedStudents.push({ student: userId, name, email, contact });
      await Student.findByIdAndUpdate(
        userId,
        { $addToSet: { joinedEvents: eventObjectId } }
      );
    } else if (userRole === "alumni") {
      event.joinedAlumni.push({ alumni: userId, name, email, contact });
      await Alumni.findByIdAndUpdate(
        userId,
        { $addToSet: { joinedEvents: eventObjectId } }
      );
    }

    await event.save();

    const creatorId = event.alumni || event.student;
    const creatorModel = event.alumni ? 'alumni' : 'student';

    await Notification.create({
      recipient: creatorId,
      recipientModel: creatorModel,
      type: 'event-joined',
      message: `${req.body.name} joined your event "${event.name}."`,
      link: `/profile/profile-events`,
    });

    return res.status(200).json({
      success: true,
      message: "Successfully joined the event",
      event,
    });
    } catch (error) {
      console.error(error);
    res.status(500).json({ success: false, message: error.message });
    }
    

  }
  

export { postEvent, getAllEvents, getEventById, editEvent, deleteEvent };