import React, { useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { deleteForum, getForumsByUser } from '../features/forumSlice';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";


const ProfileForums = () => {

  const { user, role } = useSelector((state) => state.profile);
  const { mode } = useSelector((state) => state.darkMode);

  const dispatch = useDispatch();
  const { selectedForum } = useSelector((state) => state.forums);

  const fetchselectedForum = async () => {
    try {
      const response = await dispatch(getForumsByUser({ role, id: user._id }));
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  

  const deleteAForum = async (id) => {
    try {
      const response = await dispatch(deleteForum(id));
      // console.log(response);
      toast.success('Forum deleted successfully!');
      fetchselectedForum();

    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
      fetchselectedForum();
  }, [role, user]);
  
  return (
    <div className={`rounded-sm w-full mt-10 transition-colors duration-300 ${mode ? " text-white" : "text-gray-800"}`}>
    <h2 className="text-3xl mt-4 ml-6 assistant">Forums Posted By You</h2>
  
    <div className="w-full mt-6 p-6 grid grid-cols-1 gap-4">
      {selectedForum?.length > 0 ? (
        selectedForum.map((forum) => (
          <div
            key={forum._id}
            className={`flex justify-between items-center rounded-sm p-4 shadow-md transition-all ${
              mode ? "bg-[#1e1e1e] hover:bg-[#2a2a2a]" : "bg-white hover:bg-gray-50"
            }`}
          >
            <h2 className="lato-regular text-lg hover:text-teal-500 transition">
              {forum.title}
            </h2>
            <div className="flex gap-4">
              <NavLink to={`/update-forum/${forum._id}`}>
                <button className="px-3 py-2 bg-teal-500 hover:bg-teal-600 text-white assistant rounded-sm">
                  Edit
                </button>
              </NavLink>
              <button
                onClick={() => deleteAForum(forum._id)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white assistant rounded-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center opacity-60 lato-regular">No forums found.</p>
      )}
    </div>
  </div>
  
  )
}

export default ProfileForums