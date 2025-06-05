import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { getAllForums } from '../features/forumSlice';

const Forums = () => {
  const { forums, loading, error } = useSelector((state) => state.forums);
  const { mode } = useSelector((state) => state.darkMode);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    dispatch(getAllForums());
  }, [dispatch]);

  const formatPostedDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  // console.log('forums', forums);

  return (
    <div className={`min-h-screen ${mode ? 'bg-[#121212] text-white' : ' text-gray-800'} transition-colors duration-300`}>
  {/* Add Post Button */}
  <div className="flex justify-center">
    {!!user && (
      <NavLink to="/forum-form">
        <button className="bg-teal-500 px-3 py-2 mt-10 text-white rounded-sm assistant w-60 text-[18px] cursor-pointer hover:bg-teal-600 transition-all">
          Add A Post
        </button>
      </NavLink>
    )}
  </div>

  {/* Forums List */}
  <div className="m-4 md:m-20">
    <div className={`relative flex flex-col rounded-sm shadow-sm ${mode ? 'bg-[#1f1f1f] border border-gray-700' : 'bg-white border border-slate-200'}`}>
      <nav className="flex min-w-[240px] flex-col gap-1 p-1.5">
        {loading && <p className="text-center">Loading forums...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {forums?.length === 0 && !loading && (
          <p className="text-center text-gray-400">No forums available.</p>
        )}

        {forums?.map((forum) => (
          <div
            key={forum._id}
            role="button"
            className={`flex w-full items-center rounded-md p-3 transition-all ${
              mode
                ? "hover:bg-[#2a2a2a] text-white"
                : "hover:bg-slate-100 text-slate-800"
            }`}
          >
            <div className="flex flex-col w-full">
              <h1 className="assistant text-3xl mb-2">{forum?.title}</h1>
              <p className="lato-regular mt-1 text-lg">
                Posted by {forum?.alumni?.name || forum?.student?.name} on{" "}
                {formatPostedDate(forum?.createdAt)}
              </p>
              <p
                className={`lato-regular mt-2 text-md line-clamp-1 ${mode ? "text-gray-300" : "text-gray-700"}`}
                dangerouslySetInnerHTML={{ __html: forum.description }}
              ></p>

              <div className="flex justify-center mt-4">
                <NavLink
                  to={`/forum-description/${forum?._id}`}
                  className="w-full md:w-auto"
                >
                  <button className="bg-teal-500 assistant text-white hover:bg-teal-600 cursor-pointer rounded-sm px-3 py-2 w-40 transition-all">
                    View Post
                  </button>
                </NavLink>
              </div>
              <hr className={`mt-3 ${mode ? 'border-gray-600' : 'border-gray-300'}`} />
            </div>
          </div>
        ))}
      </nav>
    </div>
  </div>
</div>

  );
};

export default Forums;
