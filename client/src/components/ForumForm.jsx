import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { useEditor, EditorContent } from "@tiptap/react";
import toast from "react-hot-toast";
import { postAForum } from "../features/forumSlice";
import { useNavigate } from "react-router-dom";

const ForumForm = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);
  const [previewImage, setPreviewImage] = useState(null);


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
    title: "",
    description: "",
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if(files && files[0]){
      setPreviewImage(files[0].name);
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  }

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
  
    const forumData = {
      title: formData.title,
      description: editor.getHTML(),
      image: formData.image,
    };
  
    try {
      await dispatch(postAForum(forumData)).unwrap();
      toast.success("Forum post submitted!");
  
      editor.commands.clearContent();
      setFormData({
        title: "",
        description: "",
        image: null,
      });
  
      // reset file input manually
      document.getElementById("user_avatar").value = null;
      setPreviewImage(null);
      navigate("/forums");
    } catch (err) {
      toast.error(err.message || "Failed to post forum.");
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
      
      <form onSubmit={handleSubmit} className={`w-[90%] mt-10 md:w-[50%] lg:w-[40%] xl:w-[30%] mx-auto p-5 rounded-sm shadow-md hover:shadow-lg transition-shadow ${
          mode
            ? "bg-[#1e1e1e] text-white border border-gray-700"
            : "bg-white text-gray-800 border border-gray-200"
        }`}>
        <div className="mb-5">
          <input
            type="text"
            id="email"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`shadow-xs border border-gray-400 text-md rounded-sm block w-full p-2.5 t ${
              mode ? "text-gray-200 placeholder-gray-500" : "text-gray-600 placeholder-gray-500"
            }`}
            placeholder="Title"
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
        <div class="mb-5 mt-4">
        <label
    htmlFor="user_avatar"
    className={`block w-full text-sm rounded-sm cursor-pointer border p-2.5 text-center font-medium transition ${
      mode
        ? "bg-[#2c2c2c] text-gray-200 border-gray-600 hover:bg-[#3a3a3a]"
        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
    }`}
  >
    Upload Image
  </label>
  <input
    id="user_avatar"
    name="image"
    type="file"
    accept="image/*"
    onChange={handleInputChange}
    className="hidden"
  />
{previewImage && (
  <div className="mt-2 text-sm text-center text-teal-500">
     {previewImage}
  </div>
)}
        </div>
        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
        >
          POST
        </button>
      </form>
    </div>
  );
};

export default ForumForm;
