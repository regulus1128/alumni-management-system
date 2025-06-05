import React, { use, useEffect, useState } from "react";
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
      navigate("/forums");
    } catch (err) {
      toast.error(err.message || "Failed to post forum.");
    }
  };
  

  const buttonClass = (isActive) =>
    `px-2 py-1 border rounded ${
      isActive ? "bg-teal-500 text-white" : "bg-gray-100"
    }`;


  return (
    <div className="w-full mt-5 flex flex-col items-center lato-regular">
      
      <form onSubmit={handleSubmit} class="w-[30%] mx-auto mt-5">
        <div class="mb-5">
          <input
            type="text"
            id="email"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            class="shadow-xs border border-gray-400 text-gray-900 text-md rounded-sm block w-full p-2.5 t"
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
          <input
            class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 p-2.5"
            aria-describedby="user_avatar_help"
            id="user_avatar"
            name="image"
            onChange={handleInputChange}
            type="file"
          />
        </div>
        <button
          type="submit"
          class="text-white bg-teal-500 w-full hover:bg-teal-600 font-medium rounded-sm text-lg px-5 py-3 text-center cursor-pointer assistant"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default ForumForm;
