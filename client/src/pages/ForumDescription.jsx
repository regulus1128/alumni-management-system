import React, { useEffect, useState } from 'react'
import classroom from "../assets/classroom.jpg"
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getSingleForum } from '../features/forumSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { formatPostedDate } from '../utils/date';
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { IoTrashOutline } from "react-icons/io5";
{/* <IoMdHeart /> */}

const URL = import.meta.env.VITE_BACKEND_URL;



const ForumDescription = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedForum, loading, error } = useSelector((state) => state.forums);
  const [singleComment, setSingleComment] = useState("");
  const [comments, setComments] = useState([]);
  const { user } = useSelector((state) => state.auth);

  // console.log(user);

  const hasUserLiked = (comment) => {
    return comment.likedBy?.some(
      (entry) => entry.user === user.id && entry.role === user.role
    );
  };

  const fetchSingleForum = async (id) => {
    try {
      const response = await dispatch(getSingleForum(id));
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCommentChange = (e) => {
    setSingleComment(e.target.value);
  }

  useEffect(() => {
    if(id){
      fetchSingleForum(id);
    }
  }, []);

  const postComment = async (e) => {
    e.preventDefault();
    try {
      if(singleComment === ""){
        toast.error("Comment cannot be empty");
        return;
      }
      const response = await axios.post(`${URL}/api/comment/post-comment/${id}`, { content: singleComment }, { withCredentials: true });
      // console.log(response);
      if(response.data.success){
        toast.success(response.data.message);
        fetchComments();
        setSingleComment("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${URL}/api/comment/get-all-comments/${id}`, { withCredentials: true });
      // console.log('comments: ', response.data);
      if(response.data.success){
        setComments(response.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const deleteComment = async (commentId) => {
    try {
      const res = await axios.delete(`${URL}/api/comment/delete-comment/${commentId}`, { withCredentials: true });
      // console.log(res);
      if(res.data.success){
        toast.success(res.data.message);
        fetchComments();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const likeComment = async (commentId) => {
    try {
      const res = await axios.post(`${URL}/api/comment/like-comment/${commentId}`, {}, { withCredentials: true });
      // console.log(res);
      if(res.data.success){
        // toast.success(res.data.message);
        fetchComments();
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchComments();
  }, [id]);
 

  return (
    <div className="w-full mt-5 flex flex-col items-center justify-center lato-regular">
      <div className="w-[90%] md:w-[70%] lg:w-[50%] mx-auto mt-5">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : selectedForum ? (
          <>
            {/* Forum Image */}
            <div className="w-full h-[300px] md:h-[400px] mb-6 rounded-sm overflow-hidden">
              <img 
                src={selectedForum.image || classroom} 
                alt="Forum Topic" 
                className="w-full h-full object-cover" 
              />
            </div>
  
            {/* Forum Title */}
            <h1 className="assistant text-2xl md:text-3xl mb-4 underline">
              {selectedForum.title}
            </h1>
  
            {/* Author */}
            <div className='flex justify-start'>
              <p className="dm-sans text-lg md:text-xl mb-2">
                Posted by {selectedForum.alumni?.name || selectedForum.student?.name || "Anonymous"}
              </p>
            </div>
  
            {/* Description */}
            <div className="mb-8 lato-regular text-base leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: selectedForum.description }} />
            </div>
  
            {/* Comments Section */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Comments ({comments.length})</h2>
  
              <form onSubmit={postComment}>
                <div className="mb-6">
                  <textarea 
                    placeholder="Add a comment..."
                    className="w-full p-3 border rounded-sm resize-none"
                    rows="3"
                    value={singleComment}
                    onChange={handleCommentChange}
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-sm hover:bg-teal-600 assistant cursor-pointer"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
  
              {/* Comments List */}
              {comments.length === 0 ? (
                <p className="text-gray-500 mb-4">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="bg-gray-200 p-4 rounded-sm mb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src={comment.alumni?.avatar || comment.student?.avatar || '/default-avatar.png'}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="font-medium">
                        {comment.alumni?.name || comment.student?.name || "Anonymous"}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                    <p className="">{comment.content} </p>
                    <p className="text-gray-600 text-sm">{formatPostedDate(comment.createdAt)}</p>
                    </div>
                    <div className='mt-2'>
                      <p className="text-gray-600 text-sm">{comment.likes} likes</p>
                    </div>
                    <div className='flex mt-2 justify-end'>
                    <button className='cursor-pointer' onClick={() => likeComment(comment._id)}>
          {hasUserLiked(comment) ? (
            <IoMdHeart className="text-red-500 " size={20} />
          ) : (
            <IoMdHeartEmpty size={20} />
          )}
        </button>
                    {user.id === comment.alumni?._id || user.id === comment.student?._id ? (
                      <button onClick={() => deleteComment(comment._id)} className='ml-2 text-red-500 hover:text-red-600 cursor-pointer'><IoTrashOutline size={20}/></button>
                    ) : ""}
                    

                    </div>
                    
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <p className="text-center">Forum not found.</p>
        )}
      </div>
    </div>
  );
  
}

export default ForumDescription