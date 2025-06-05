import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getEventById } from '../features/eventSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpdateEvent = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "", // initial content
  });

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    date: "",
    time: "",
    dateTime: "",
  });

  const fetchEventById = async (id) => {
    try {
      const response = await dispatch(getEventById(id));
      console.log(response.payload);
      const event = response.payload.event;
      const eventDate = new Date(event.dateTime);
      const formattedDate = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD
      const formattedTime = eventDate.toTimeString().slice(0, 5); // HH:MM
      setFormData({
        ...event,
        date: formattedDate,
        time: formattedTime,
      });

      if (editor && event.description) {
        editor.commands.setContent(event.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(id){
      fetchEventById(id);
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedDescription = editor?.getHTML();
  
    const dateTime = new Date(`${formData.date}T${formData.time}`);
  
    try {
      const updatedData = {
        name: formData.name,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        description: updatedDescription,
        id: id,
      };
  
      const response = await axios.put(`${backendUrl}/api/event/edit-event/${id}`, updatedData, { withCredentials: true });
  
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/profile/profile-events");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  

  const buttonClass = (isActive) =>
  `px-2 py-1 border rounded ${
    isActive ? "bg-teal-500 text-white" : "bg-gray-100"
  }`;
  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
    <form onSubmit={handleSubmit} class="w-[30%] mx-auto mt-5 shadow-md hover:shadow-lg transition-shadow bg-white p-5 rounded-sm">
      <div class="mb-5">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
          placeholder="Event Name"
          required
        />
      </div>
      <div class="mb-5">
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
          placeholder="Location"
          required
        />
      </div>
      <div class="mb-5">
        <input
          type="date" 
          name="date"
          value={formData.date}
          onChange={handleChange}
          class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
          placeholder="Date"
          required
        />
      </div>
      <div class="mb-5">
        <input
          type="time" 
          name="time"
          value={formData.time}
          onChange={handleChange}
  
          class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
          placeholder="Time"
          required
        />
      </div>
      <div className="border border-gray-400 rounded-sm p-2 min-h-[150px]">
          {editor && (
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={buttonClass(editor.isActive("bold"))}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={buttonClass(editor.isActive("italic"))}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={buttonClass(editor.isActive("underline"))}
              >
                Underline
              </button>

              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={buttonClass(editor.isActive("bulletList"))}
              >
                Bullet List
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={buttonClass(editor.isActive("orderedList"))}
              >
                Numbered List
              </button>

              
              
            </div>
          )}
          <EditorContent editor={editor} />
        </div>
      
      

      <button
        type="submit"
        class="text-white bg-teal-500 w-full mt-4 hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
      >
        Update Your Event
      </button>
    </form>
  </div>
  )
}

export default UpdateEvent