import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { deleteJob, fetchJobById, updateJob } from "../features/jobSlice";


const UpdateJob = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
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
    jobRole: "",
    company: "",
    location: "",
    jobType: "Full Time",
    salary: "",
  });

  const getJobById = async (id) => {
    try {
      const response = await dispatch(fetchJobById(id));
      // console.log(response.payload);
      const job = response.payload.job;
      setFormData(job);

      if (editor && job.description) {
        editor.commands.setContent(job.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editor && formData.description) {
      editor.commands.setContent(formData.description);
    }
  }, [editor, formData.description]);

  useEffect(() => {
    if (id) {
      getJobById(id);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedDescription = editor?.getHTML();

    try {
      const updatedData = {
        ...formData,
        description: updatedDescription, // include updated description
        id: id,
      };
      const response = await dispatch(updateJob(updatedData));
      // console.log(response);
      if (response.payload.success) {
        toast.success(response.payload.message);
        navigate("/profile/profile-jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const buttonClass = (isActive) =>
    `px-2 py-1 border rounded ${
      isActive ? "bg-teal-500 text-white" : "bg-gray-100"
    }`;
  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
      <h1 className="assistant text-2xl">Update your job details here</h1>
      <form onSubmit={handleSubmit} class="w-[30%] mx-auto mt-5">
        <div class="mb-5">
          <input
            type="text"
            id="email"
            name="jobRole"
            value={formData.jobRole}
            onChange={handleChange}
            class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
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
            class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
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
            class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Location"
            required
          />
        </div>

        <div className="mb-5">
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
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  className={buttonClass(editor.isActive("bulletList"))}
                >
                  Bullet List
                </button>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
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
            className="shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t resize-none"
          >
            <option>Full Time</option>
            <option>Part Time/Internship</option>
          </select>
        </div>
        <div class="mb-5">
          <input
            type="number"
            id="email"
            value={formData.salary}
            name="salary"
            onChange={handleChange}
            class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
            placeholder="Salary(per month)"
            required
          />
        </div>

        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant mb-10"
        >
          Update Job Details
        </button>
      </form>
    </div>
  );
};

export default UpdateJob;
