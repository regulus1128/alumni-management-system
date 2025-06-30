import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.MODE === "development" ? "http://localhost:3000" : 
import.meta.env.VITE_BACKEND_URL;
const AlumniList = () => {
  const [alumniList, setAlumniList] = useState([]);

  const fetchAlumni = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/alumni`, {
        withCredentials: true,
      });
      // console.log("alumni: ", res.data.alumni);
      if (res.data.success) {
        setAlumniList(res.data.alumni);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyStatus = async (id, verified) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/admin/verify/alumni/${id}`,
        { verified },
        { withCredentials: true }
      );
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAlumni();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/delete-alumni/${id}`, { withCredentials: true });
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchAlumni();
      }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchAlumni();
  }, []);
  return (
    <div>
      <div class="relative overflow-x-auto shadow-md rounded-sm">
        <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead class="text-lg text-white uppercase bg-gray-500 assistant">
            <tr>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Department
              </th>
              <th scope="col" class="px-6 py-3">
                Job Role & company
              </th>
              <th scope="col" class="px-6 py-3">
                Email
              </th>
              <th scope="col" class="px-6 py-3">
                Status
              </th>
              <th scope="col" class="px-6 py-3"></th>
            </tr>
          </thead>
          {alumniList.length > 0 ? (
            <tbody className="lato-regular text-[15px]">
              {alumniList.map((alumni, index) => (
                <tr
                  key={alumni._id || index}
                  className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-black whitespace-nowrap"
                  >
                    {alumni.name}
                  </th>
                  <td className="px-6 py-4">{alumni.dept}</td>
                  <td className="px-6 py-4">
                    {alumni.jobRole}, {alumni.company}
                  </td>
                  <td className="px-6 py-4">{alumni.email}</td>
                  <td className="px-6 py-4">
                    {alumni.verified ? "Verified" : "Not Verified"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          verifyStatus(alumni._id, !alumni.verified)
                        }
                        className="w-[90px] py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-full text-sm font-semibold text-center cursor-pointer"
                      >
                        {alumni.verified ? "Unverify" : "Verify"}
                      </button>

                      <button
                      onClick={() => handleDelete(alumni._id)} 
                      className="w-[90px] py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold text-center cursor-pointer">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No alumni found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default AlumniList;
