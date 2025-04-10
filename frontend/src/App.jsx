import "./App.css";
import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Deals from "./components/Deals";
import AnalyticsDashboard from "./components/Analytics";
import Navbar from "./components/Navbar";
import { AppContext } from "./context/Appcontext";
import Home from "./components/Home";
import UserDashBoard from "./components/UserDashBoard";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user?.role === "admin" ? children : <Navigate to="/user-dashboard" />;
};

const App = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : user.role === "admin" ? (
                <Navigate to="/analytics" />
              ) : (
                <Navigate to="/user-dashboard" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !user ? (
                <Register />
              ) : user.role === "admin" ? (
                <Navigate to="/analytics" />
              ) : (
                <Navigate to="/user-dashboard" />
              )
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute>
                <UserDashBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/deals"
            element={
              <PrivateRoute>
                <Deals />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminRoute>
                <AnalyticsDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
