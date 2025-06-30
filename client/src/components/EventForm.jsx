import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { postAnEvent } from "../features/eventSlice";

const EventForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);

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
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    const { name, location, date, time } = formData;

    if (!name || !date || !location || !time) {
      toast.error("Please fill all job fields.");
      return;
    }

    if (!editor || editor.getText().trim() === "") {
      toast.error("Please enter an event description.");
      return;
    }

    const eventData = {
      ...formData,
      description: editor.getHTML(), // submit HTML content
    };

    // console.log(eventData);

    try {
      const res = await dispatch(postAnEvent(eventData)).unwrap();
      console.log(res);
      toast.success("Event posted successfully!");
      editor.commands.clearContent();
      setFormData({
        name: "",
        date: "",
        location: "",
        time: "",
      });
      navigate("/events");
    } catch (err) {
      toast.error(err.message || "Failed to post event.");
      console.log(err);
    }
  };

  const buttonClass = (isActive) =>
    `px-2 py-1 text-sm rounded border transition-colors duration-200 ${
      isActive
        ? "bg-teal-600 text-white"
        : mode
        ? "bg-[#2c2c2c] text-gray-300 border-gray-600 hover:bg-[#3a3a3a]"
        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
    }`;

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center lato-regular transition-colors duration-300 ${
        mode ? "bg-[#121212] text-white" : "bg-white text-gray-800"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className={`w-[90%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto mt-10 shadow-md hover:shadow-lg transition-shadow p-5 rounded-sm ${
          mode
            ? "bg-[#1e1e1e] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        }`}
      >
        {/* Event Name */}
        <div className="mb-5">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`shadow-xs border rounded-sm block w-full p-2.5 text-md ${
              mode
                ? "bg-[#2c2c2c] text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-400"
            }`}
            placeholder="Event Name"
            required
          />
        </div>

        {/* Location */}
        <div className="mb-5">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`shadow-xs border rounded-sm block w-full p-2.5 text-md ${
              mode
                ? "bg-[#2c2c2c] text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-400"
            }`}
            placeholder="Location"
            required
          />
        </div>

        {/* Date */}
        <div className="mb-5">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`shadow-xs border rounded-sm block w-full p-2.5 text-md ${
              mode
                ? "bg-[#2c2c2c] text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-400"
            }`}
            required
          />
        </div>

        {/* Time */}
        <div className="mb-5">
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`shadow-xs border rounded-sm block w-full p-2.5 text-md ${
              mode
                ? "bg-[#2c2c2c] text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-400"
            }`}
            required
          />
        </div>

        {/* Editor */}
        <div
          className={`border rounded-sm p-2 min-h-[150px] ${
            mode ? "border-gray-600 bg-[#2a2a2a]" : "border-gray-400 bg-white"
          }`}
        >
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

              <button
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run();
                  }
                }}
                className={buttonClass(editor.isActive("link"))}
              >
                Link
              </button>

              <button
                onClick={() => editor.chain().focus().unsetLink().run()}
                className={`px-2 py-1 border rounded text-sm ${
                  mode
                    ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
                    : "bg-red-100 text-red-600 border-red-300 hover:bg-red-200"
                }`}
              >
                Remove Link
              </button>
            </div>
          )}
          <EditorContent
            editor={editor}
            className={`min-h-[100px] px-2 py-1 rounded-sm ${
              mode ? "bg-[#1e1e1e] text-white" : "bg-white text-black"
            }`}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="text-white mt-4 bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
        >
          Post Your Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
