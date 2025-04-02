import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { setToken, setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await loginUser({ email, password, username });
      if (response.success) {
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem("token", response.token);
        console.log(response.user.role)
        setTimeout(() => {
          if(response.user.role === 'admin') {
            navigate("/analytics");
          } else {
            navigate("/deals");
          }
        }, 0);
      } else {
        setError(response.message || "Invalid credentials");
      }
    } catch (error) {
      setError("Login failed! Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Left side brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 p-12 flex-col justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-6">Welcome Back</h1>
          <p className="text-blue-100 text-lg mb-8">
            Access your account to find the best deals tailored just for you.
          </p>
          
          {/* Testimonial */}
          <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg mt-12 border-l-4 border-blue-400">
            <p className="italic text-gray-300 mb-4">
              "Welcome Back folks!"
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                SJ
              </div>
              <div className="ml-3">
                <p className="font-medium text-white">Saurabh Jaiswar</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-gray-400 text-sm">
          © 2025 Your Company. All rights reserved.
        </div>
      </div>
      
      {/* Right side login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400">Enter your details to access your account</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-900/40 border border-red-800 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-400 text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Sign In"}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Create an account
              </a>
            </p>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a> and <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;