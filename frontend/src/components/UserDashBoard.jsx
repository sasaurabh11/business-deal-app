import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/Appcontext';
import { getAllUser } from '../services/api';

const UserDashBoard = () => {
    const { user } = useContext(AppContext);
    const [sellers, setSellers] = useState([]);

    useEffect(() => {
        console.log(user)
        const fetchUsers = async () => {
            if (!user) {
                window.location.href = '/login';
                return;
            }
            try {
                const response = await getAllUser();
                if (response.success) {
                    setSellers(response.users);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchUsers();
    }, [user]);

    if (!user) {
        return null; 
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-white mb-2">User Dashboard</h1>
                <p className="text-center text-gray-400 mb-8">Welcome to your dashboard, {user.name}!</p>
                
                <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                    {user.role === 'buyer' ? (
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                                Available Sellers
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sellers.map((seller) => (
                                    seller.role === 'seller' && (
                                        <div 
                                            key={seller._id} 
                                            className="bg-gray-700 hover:bg-gray-600 transition-colors p-4 rounded-lg"
                                        >
                                            <h3 className="text-xl font-semibold text-white">{seller.name}</h3>
                                            <p className="text-gray-300 mt-2">
                                                <span className="font-medium">Email:</span> {seller.email}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-medium">Username:</span> {seller.username}
                                            </p>
                                            <button  className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors">
                                                Contact Seller
                                            </button>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                                Your Deals
                            </h2>
                            <div className="bg-gray-700 p-6 rounded-lg">
                                <p className="text-gray-300 text-center">
                                    You don't have any active deals yet.
                                </p>
                                <button className="mt-4 mx-auto block bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded transition-colors">
                                    Create New Deal
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashBoard;