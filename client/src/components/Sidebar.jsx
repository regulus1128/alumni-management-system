import { NavLink, useNavigate } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { PiStudentFill } from "react-icons/pi";
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { MdEventAvailable, MdForum } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { logoutUser } from "../features/authSlice.js";
import { PiStudentLight } from "react-icons/pi";
import { IoBookSharp } from "react-icons/io5";


function Sidebar() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.darkMode);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logout successful!");
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      console.log(error);
      toast.error("Logout failed!");
    }
  };
  return (
    <div className={`w-full max-w-[20rem] flex-shrink-0 p-7 shadow-xl shadow-blue-gray-900/5 transition-colors duration-300  
  ${mode ? "bg-[#121212] text-gray-300 border-r border-gray-800" : "bg-[#f3f3f3] text-gray-700 border-r border-gray-200"}`}>
  <nav className={`flex min-w-[240px] flex-col gap-1 p-4 text-xl font-normal assistant`}>
    {[
      { to: "/dashboard", label: "Home", icon: <IoMdHome size={20} />, end: true },
      { to: "/dashboard/alumni-list", label: "Alumni List", icon: <PiStudentFill size={20} /> },
      { to: "/dashboard/student-list", label: "Students List", icon: <PiStudentLight size={20} /> },
      { to: "/dashboard/job-list", label: "Jobs", icon: <BsFillSuitcaseLgFill size={20} /> },
      { to: "/dashboard/events-list", label: "Events", icon: <MdEventAvailable size={20} /> },
      { to: "/dashboard/forums-list", label: "Forums", icon: <MdForum size={20} /> },
      { to: "/dashboard/courses-list", label: "Courses", icon: <IoBookSharp size={20} /> },
    ].map(({ to, label, icon, end }) => (
      <NavLink
        to={to}
        key={label}
        end={end}
        className={({ isActive }) => `
          flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start 
          ${isActive
            ? mode
              ? "bg-gray-700 text-white"
              : "bg-gray-300 text-gray-900"
            : mode
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-gray-300 text-gray-700"
          } 
          cursor-pointer
        `}
      >
        <div className="grid mr-4 place-items-center">{icon}</div>
        {label}
      </NavLink>
    ))}

    <div
      onClick={handleLogout}
      className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start 
        ${mode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-300 text-gray-700"} 
        cursor-pointer`}
    >
      <div className="grid mr-4 place-items-center">
        <RiShutDownLine size={20} />
      </div>
      Logout
    </div>
  </nav>
</div>

  );
}

export default Sidebar;
