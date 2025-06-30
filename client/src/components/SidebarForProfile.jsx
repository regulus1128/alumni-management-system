import { NavLink, useNavigate } from "react-router-dom";
import { BsChatQuoteFill } from "react-icons/bs";
import { BsFillSuitcaseLgFill } from "react-icons/bs";
import { MdEventAvailable, MdForum } from "react-icons/md";
import { RiShutDownLine } from "react-icons/ri";
import { IoIosInformationCircle } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { logoutUser } from "../features/authSlice.js";
import { fetchUserProfile } from "../features/profileSlice.js";
import { useEffect } from "react";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { IoMdHome } from "react-icons/io";

function SidebarForProfile({ closeSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((state) => state.profile);
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

  const fetchProfile = async () => {
    try {
      await dispatch(fetchUserProfile());
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = () => {
    if (window.innerWidth < 1024 && closeSidebar) closeSidebar();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    
    <div className={`w-full max-w-[20rem] h-full flex-shrink-0 p-3 transition-colors duration-300  
  ${mode ? "bg-[#121212] text-gray-100 border-r-2 border-gray-800" : "bg-[#f3f3f3] text-gray-700 border-r-2 border-gray-200"}`}>
  <Toaster/>
  <nav className={`flex min-w-[240px] flex-col gap-1 p-4 text-xl font-normal assistant 
  ${mode ? "text-gray-300" : "text-blue-gray-700"}`}>
  
  {[
    { to: "/profile", icon: <IoIosInformationCircle size={20} />, label: "Personal Info", end: true },
    { to: "/profile/profile-connections", icon: <MdOutlineConnectWithoutContact size={20} />, label: "Connections" },
    ...(user && role ? [{ to: "/profile/profile-jobs", icon: <BsFillSuitcaseLgFill size={20} />, label: "Jobs" }] : []),
    ...(user && role ? [
      { to: "/profile/profile-events", icon: <MdEventAvailable size={20} />, label: "Your Events" },
      { to: "/profile/profile-forums", icon: <MdForum size={20} />, label: "Your Forums" },
      { to: "/profile/chats", icon: <BsChatQuoteFill size={20} />, label: "Chats" },
      { to: "/", icon: <IoMdHome size={20}/>, label: "Home" },

    ] : []),
  ].map(({ to, icon, label, end }) => (
    <NavLink
      key={to}
      to={to}
      end={end} 
      onClick={handleClick}
      className={({ isActive }) => `
        flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start 
        ${isActive 
          ? mode 
            ? "bg-[#2b2b2b] text-white" 
            : "bg-gray-300 text-gray-800" 
          : mode 
            ? "hover:bg-[#2b2b2b] text-gray-300" 
            : "hover:bg-gray-300 text-gray-600"}
        cursor-pointer
      `}
    >
      <div className="grid mr-4 place-items-center">
        {icon}
      </div>
      {label}
    </NavLink>
  ))}

  <div
    onClick={handleLogout}
    className={`flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start 
      ${mode 
        ? "text-red-400 hover:bg-[#2b2b2b]" 
        : "text-red-500 hover:bg-gray-300"}
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

export default SidebarForProfile;
