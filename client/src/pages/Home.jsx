import React, { useEffect } from "react";
import cs from "../assets/cs.jpg";
import { NavLink } from "react-router-dom";
import Events from "../components/Events";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const { mode } = useSelector((state) => state.darkMode);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const features = [
    {
      title: "Connect with Alumni",
      description: "Build your network and connect with alumni across batches.",
    },
    {
      title: "Explore Jobs",
      description: "Find job opportunities posted by experienced alumni.",
    },
    {
      title: "Join Events",
      description: "Participate in exciting alumni meets and campus events.",
    },
    {
      title: "Engage in Forums",
      description: "Ask questions, share ideas, and interact in forums.",
    },
  ];
  
  useEffect(() => {
    if (user?._id) {
      dispatch(initializeSocket(user._id));
    }
  }, [user]);

  return (
    <div className={` min-h-screen`}>
      {/* Hero Section */}
      <div className="relative w-full h-[80vh]">
        <img src={cs} className="absolute inset-0 w-full h-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-opacity-50 flex flex-col items-center justify-center px-4 text-center lato-regular">
          <h1 className="text-5xl font-bold mb-4 text-white">Welcome to Alumverse!</h1>
          <p className="text-lg mb-6 text-gray-100 max-w-2xl">
            Stay connected with your college community. Discover opportunities, build your network, and never miss an update.
          </p>
          {!user && (
            <div className="flex gap-4 flex-wrap justify-center">
              <NavLink to="/login">
                <button className="bg-teal-500 px-5 py-2  w-32 rounded-sm text-white text-lg hover:bg-teal-600 transition cursor-pointer">LOGIN</button>
              </NavLink>
              <NavLink to="/register">
                <button className="bg-teal-500 px-5 py-2 w-32 rounded-sm text-white text-lg hover:bg-teal-600 transition cursor-pointer">REGISTER</button>
              </NavLink>
            </div>
          )}
          {user && (
            <h2 className="text-2xl font-medium text-white mt-4">
              Welcome back, {user.name || ""}!
            </h2>
          )}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-20 bg-gray-100 dark:bg-[#1e1e1e] lato-regular">
        <h2 className="text-3xl font-bold text-center mb-12 text-teal-600">What You Can Do</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-[#2c2c2c] p-6 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-teal-500">{feature.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Component */}
      <div>
        {/* <Events /> */}
      </div>
    </div>
  );
};

export default Home;
