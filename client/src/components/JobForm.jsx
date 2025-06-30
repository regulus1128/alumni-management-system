import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useDispatch, useSelector } from "react-redux";
import { postJob } from "../features/jobSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const JobForm = () => {


  const dispatch = useDispatch();
  const editor = useEditor({
    extensions: [StarterKit, Underline,
      Link.configure({
        openOnClick: false,
      }),],
    content: "", // initial content
  });
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);

  const [formData, setFormData] = useState({
    jobRole: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    const { jobRole, company, location, jobType, salary } = formData;

    if (!jobRole || !company || !location || !jobType || !salary) {
      toast.error("Please fill all job fields.");
      return;
    }

    if (!editor || editor.getText().trim() === "") {
      toast.error("Please enter a job description.");
      return;
    }

    const jobData = {
      ...formData,
      description: editor.getHTML(), // submit HTML content
    };

    // console.log(jobData);

    try {
      await dispatch(postJob(jobData)).unwrap();
      toast.success("Job posted successfully!");
      editor.commands.clearContent();
      setFormData({
        jobRole: "",
        company: "",
        location: "",
        jobType: "Full Time",
        salary: "",
      });
      navigate("/jobs");
    } catch (err) {
      toast.error(err.message || "Failed to post job.");
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
    <div className={`w-full min-h-screen flex flex-col items-center lato-regular transition-colors duration-300 ${
      mode ? "bg-[#121212] text-white" : "bg-white text-gray-800"
    }`}>
      <h1 className="assistant text-2xl mt-5">Enter your job details here</h1>
      <form onSubmit={handleSubmit} className={`w-[90%] md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto mt-5 p-5 rounded-sm shadow-md hover:shadow-lg transition-shadow ${
          mode
            ? "bg-[#1e1e1e] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        }`}>
        <div class="mb-5">
          <input
            type="text"
            id="email"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t ${
              mode ? "text-gray-200 placeholder-gray-500" : "text-gray-600 placeholder-gray-500"
            }`}
            placeholder="Job Role"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="text"
            id="email"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t ${
              mode ? "text-gray-200 placeholder-gray-500" : "text-gray-600 placeholder-gray-500"
            }`}
            placeholder="Company/Organization"
            required
          />
        </div>
        <div class="mb-5">
          <input
            type="text"
            id="email"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t ${
              mode ? "text-gray-200 placeholder-gray-500" : "text-gray-600 placeholder-gray-500"
            }`}
            placeholder="Location"
            required
          />
        </div>

          <div className="mb-5">
            
          
          <div className="border border-gray-400 rounded-sm p-2 min-h-[150px]">
          {editor && (
  <div className="flex flex-wrap gap-2 mb-3">
    <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}>Bold</button>
    <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}>Italic</button>
    <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive("underline"))}>Underline</button>

    

    <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive("bulletList"))}>Bullet List</button>
    <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive("orderedList"))}>Numbered List</button>

    <button
      onClick={() => {
        const url = prompt("Enter URL");
        if (url) {
          editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        }
      }}
      className={buttonClass(editor.isActive("link"))}
    >
      Link
    </button>
    
  </div>
)}
            <EditorContent editor={editor} />
          </div>
        </div>
        <div className="mb-5">
          <select
            id="countries"
            value={formData.jobType}
            name="jobType"
            onChange={handleChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t resize-none ${
              mode ? "text-gray-200 bg-[#1e1e1e]" : "text-gray-600 bg-white"
            }`}
          >
            <option>Full Time</option>
            <option>Internship</option>
          </select>
        </div>
        <div class="mb-5">
          <input
            type="number"
            id="email"
            value={formData.salary}
            name="salary"
            onChange={handleChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t ${
              mode ? "text-gray-200 placeholder-gray-500" : "text-gray-600 placeholder-gray-500"
            }`}
            placeholder="Salary(per month)"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant mb-10"
        >
          POST YOUR JOB
        </button>
      </form>
    </div>
  );
};

export default JobForm;
