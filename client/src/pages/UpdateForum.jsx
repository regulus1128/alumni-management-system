import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { getSingleForum } from "../features/forumSlice";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;

const UpdateForum = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { mode } = useSelector((state) => state.darkMode);
  


  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: "", // will be set later
  });

  const [formData, setFormData] = useState({
    title: "",
    image: null,
    description: "", // this will sync with the editor
  });

  // Fetch forum on mount
  const fetchForumById = async (id) => {
    try {
      const res = await dispatch(getSingleForum(id));
      const forum = res.payload.forum;

      setFormData({
        title: forum.title || "",
        image: null,
        description: forum.description || "",
      });
    } catch (error) {
      console.log("Fetch error: ", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchForumById(id);
    }
  }, [id]);

  // Update editor when description loads
  useEffect(() => {
    if (editor && formData.description) {
      editor.commands.setContent(formData.description);
    }
  }, [editor, formData.description]);

  const handleInputChange = (e) => {
    const { name, type, files, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title.");
      return;
    }

    if (!editor || editor.getText().trim() === "") {
      toast.error("Please enter a forum description.");
      return;
    }

    const updatedForm = new FormData();
    updatedForm.append("title", formData.title);
    updatedForm.append("description", editor.getHTML());
    if (formData.image) {
      updatedForm.append("image", formData.image);
    }

    try {
      const response = await axios.put(`${backendUrl}/api/forum/edit/${id}`, updatedForm, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data.message || "Forum updated!");
      navigate("/profile/profile-forums");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update forum.");
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
      <form onSubmit={handleSubmit} className={`w-full max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[40%] mx-auto mt-5 shadow-md hover:shadow-lg transition-shadow ${
          mode
            ? "bg-[#1e1e1e] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        } p-5 rounded-sm`}>
        <div className="mb-5">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`shadow-xs border border-gray-400  text-md rounded-sm block w-full p-2.5`}
            placeholder="Title"
            required
          />
        </div>

        <div className="border border-gray-400 rounded-sm p-2 min-h-[150px]">
          {editor && (
            <div className="flex flex-wrap gap-2 mb-3">
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive("bold"))}>Bold</button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive("italic"))}>Italic</button>
              <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={buttonClass(editor.isActive("underline"))}>Underline</button>
              <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive("bulletList"))}>Bullet List</button>
              <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive("orderedList"))}>Numbered List</button>
              <button onClick={() => {
                const url = prompt("Enter URL");
                if (url) {
                  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }
              }} className={buttonClass(editor.isActive("link"))}>Link</button>
              <button onClick={() => editor.chain().focus().unsetLink().run()} className="px-2 py-1 border rounded bg-red-100 text-red-600">Remove Link</button>
            </div>
          )}
          <EditorContent editor={editor} />
        </div>

        <div className="mb-5 mt-4">
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5"
            id="user_avatar"
            name="image"
            onChange={handleInputChange}
            type="file"
          />
        </div>

        <button
          type="submit"
          className="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
        >
          Update Forum
        </button>
      </form>
    </div>
  );
};

export default UpdateForum;
