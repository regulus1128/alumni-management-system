import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/students`, {
        withCredentials: true,
      });
      // console.log(res);
      if (res.data.success) {
        setStudentList(res.data.students);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const verifyStatus = async (id, verified) => {
    try {
      const res = await axios.patch(
        `${backendUrl}/api/admin/verify/student/${id}`,
        { verified },
        { withCredentials: true }
      );
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchStudents();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${backendUrl}/api/admin/delete-student/${id}`, { withCredentials: true });
      // console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchStudents();
      }
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    fetchStudents();
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
                Current degree
              </th>
              <th scope="col" class="px-6 py-3">
                batch
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
          {studentList.length > 0 ? (
            <tbody className="lato-regular text-[15px]">
              {studentList.map((student, index) => (
                <tr
                  key={student._id || index}
                  className="bg-neutral-200 text-black border-b border-gray-200 hover:bg-gray-300"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-black whitespace-nowrap"
                  >
                    {student.name}
                  </th>
                  <td className="px-6 py-4">{student.dept}</td>
                  <td className="px-6 py-4">
                    {student.pursuing}
                  </td>
                  <td className="px-6 py-4">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4">{student.email}</td>
                  <td className="px-6 py-4">
                    {student.verified ? "Verified" : "Not Verified"}
                  </td>
                  <td className="px-6 py-4 text-right">
                  <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          verifyStatus(student._id, !student.verified)
                        }
                        className="w-[90px] py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-full text-sm font-semibold text-center cursor-pointer"
                      >
                        {student.verified ? "Unverify" : "Verify"}
                      </button>

                      <button onClick={() => handleDelete(student._id)} className="w-[90px] py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-semibold text-center cursor-pointer">
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
                  No student found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default StudentList;
