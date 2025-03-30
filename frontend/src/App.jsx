import "./App.css";
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Deals from './components/Deals';
import DealDetails from './components/DealDetails';
import Analytics from './components/Analytics';
import Navbar from './components/Navbar';
import { AppContext } from './context/Appcontext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useContext(AppContext); // Fixed: using useContext instead of useAppContext
  return user?.role === 'admin' ? children : <Navigate to="/deals" />;
};

const App = () => {
  const { user } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/deals" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/deals" />} />
          <Route
            path="/deals"
            element={
              <PrivateRoute>
                <Deals />
              </PrivateRoute>
            }
          />
          <Route
            path="/deals/:dealId"
            element={
              <PrivateRoute>
                <DealDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to={user ? "/deals" : "/login"} />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;