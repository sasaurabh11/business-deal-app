import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="relative w-full max-w-lg px-8 py-10 mx-4 overflow-hidden bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-900 rounded-full opacity-20 -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-900 rounded-full opacity-20 -mr-16 -mb-16"></div>
        
        {/* Logo placeholder */}
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-center text-white">
          Business Deal Room
        </h1>
        
        <p className="mb-8 text-center text-gray-300">
          Your secure platform for negotiating deals and managing high-value transactions with confidence.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center w-full py-3 text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </span>
            Sign In
          </button>
          
          <button
            onClick={() => navigate("/register")}
            className="flex items-center justify-center w-full py-3 text-white transition-all duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            Create Account
          </button>
        </div>
        
        <div className="pt-6 mt-8 text-center">
          <p className="text-gray-400 text-sm flex items-center justify-center">
            Made with 
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            by Saurabh
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;