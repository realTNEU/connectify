import React from "react";
import { Link } from "react-router-dom";

const HomeContent = () => {
  return (
    <>
      <div className="flex flex-col pt-10 items-center h-screen bg-gray-100 mb-0 pb-0">
        <h2 className="text-3xl font-bold mb-4 text-[#2d2d2d]">
          Welcome to Connectify
        </h2>
        <p className="text-lg text-[#2d2d2d] mb-4">Your free online video calling service.</p>
      </div>

      <div className="flex flex-col items-center bg-white py-5 -mt-[33rem]"> 
        <h3 className="text-2xl font-semibold text-[#2d2d2d] mb-4">Features</h3>
        <ul className="space-y-4 text-lg text-gray-600">
          <li>📞 High-quality video calls</li>
          <li>💬 Instant messaging</li>
          <li>📅 Schedule calls easily</li>
          <li>🔒 Secure and private communications</li>
        </ul>
      </div>

      <div className="flex flex-col items-center bg-white py-10">
        <h3 className="text-2xl font-semibold text-[#2d2d2d] mb-4">
          Join Us Today!
        </h3>
        <p className="text-lg text-gray-600 mb-4">
          Sign up now to experience seamless communication.
        </p>
        <Link to="/signup"> {/* Use Link for navigation */}
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </>
  );
};

export default HomeContent;
