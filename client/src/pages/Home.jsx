import React, { useEffect } from "react";
import cs from "../assets/cs.jpg";
import { NavLink } from "react-router-dom";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        </div>

        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-y-12 translate-y-20"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center lato-regular">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Alumverse!
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Stay connected with your college community. Discover opportunities, build your network, and never miss an
              update.
            </p>

            {!user && (
              <div className="flex gap-6 flex-wrap justify-center">
                <NavLink to="/login">
                  <button className="bg-white text-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]">
                    LOGIN
                  </button>
                </NavLink>
                <NavLink to="/register">
                  <button className="bg-teal-700 px-8 py-4 rounded-xl text-white text-lg font-semibold hover:bg-teal-800 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]">
                    REGISTER
                  </button>
                </NavLink>
              </div>
            )}

            {user && (
              <div className="">
                <h2 className="text-2xl font-medium text-white">Welcome back, {user.name || ""}!</h2>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-50 dark:bg-[#1e1e1e] lato-regular">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              What You Can Do
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-[#2c2c2c] p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-6 h-6 bg-white rounded-md"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Component */}
      <div>{/* <Events /> */}</div>
    </div>
  );
};

export default Home;
