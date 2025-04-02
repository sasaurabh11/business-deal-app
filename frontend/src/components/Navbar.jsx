import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AppContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold tracking-wide text-blue-400">
                    Business Deal Room
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/deals" className="hover:text-blue-400 transition duration-300">
                        Deals
                    </Link>

                    {/* {user?.role === "admin" && (
                        <Link to="/analytics" className="hover:text-blue-400 transition duration-300">
                            Analytics
                        </Link>
                    )} */}

                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400 transition duration-300">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden mt-4 flex flex-col space-y-4 bg-gray-800 p-4 rounded-lg">
                    <Link to="/deals" className="hover:text-blue-400 transition duration-300">
                        Deals
                    </Link>
                    {/* {user?.role === "admin" && (
                        <Link to="/analytics" className="hover:text-blue-400 transition duration-300">
                            Analytics
                        </Link>
                    )} */}
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-blue-400 transition duration-300">
                                Login
                            </Link>
                            <Link to="/register" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
