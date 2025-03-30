import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { getAllUser, getUserDeals } from '../services/api';

const UserDashBoard = () => {
    const { user } = useContext(AppContext);
    const [sellers, setSellers] = useState([]);
    const [deals, setDeals] = useState([]);
    const [activeTab, setActiveTab] = useState('sellers'); // 'sellers' or 'deals'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        
        const fetchData = async () => {
            try {
                setLoading(true);
                if (user.role === 'buyer') {
                    const [usersResponse, dealsResponse] = await Promise.all([
                        getAllUser(),
                        getUserDeals(user._id)
                    ]);
                    
                    if (usersResponse.success) {
                        setSellers(usersResponse.users.filter(u => u.role === 'seller'));
                    }
                    if (dealsResponse.success) {
                        setDeals(dealsResponse.deals);
                    }
                } else {
                    const dealsResponse = await getUserDeals(user._id);
                    if (dealsResponse.success) {
                        setDeals(dealsResponse.deals);
                    }
                }
            } catch (error) {
                setError('Failed to load data. Please try again.');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleSellerClick = (sellerId) => {
        navigate(`/deals?sellerId=${sellerId}`);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-center text-white mb-2">User Dashboard</h1>
                <p className="text-center text-gray-400 mb-8">Welcome, {user.name}!</p>
                
                <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                    {user.role === 'buyer' ? (
                        <div>
                            {/* Toggle Menu for Buyers */}
                            <div className="flex border-b border-gray-700 mb-6">
                                <button
                                    className={`px-4 py-2 font-medium ${activeTab === 'sellers' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveTab('sellers')}
                                >
                                    Available Sellers
                                </button>
                                <button
                                    className={`px-4 py-2 font-medium ${activeTab === 'deals' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'}`}
                                    onClick={() => setActiveTab('deals')}
                                >
                                    Your Deals
                                </button>
                            </div>

                            {/* Sellers Tab */}
                            {activeTab === 'sellers' && (
                                <div>
                                    {loading ? (
                                        <p className="text-center text-gray-400 py-4">Loading sellers...</p>
                                    ) : sellers.length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">No sellers available at the moment.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {sellers.map((seller) => (
                                                <div 
                                                    key={seller._id} 
                                                    className="bg-gray-700 hover:bg-gray-600 transition-colors p-4 rounded-lg cursor-pointer"
                                                    onClick={() => handleSellerClick(seller._id)}
                                                >
                                                    <h3 className="text-xl font-semibold text-white">{seller.name}</h3>
                                                    <p className="text-gray-300 mt-2">
                                                        <span className="font-medium">Email:</span> {seller.email}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="font-medium">Username:</span> {seller.username}
                                                    </p>
                                                    <button 
                                                        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSellerClick(seller._id);
                                                        }}
                                                    >
                                                        Contact Seller
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Deals Tab */}
                            {activeTab === 'deals' && (
                                <div>
                                    {loading ? (
                                        <p className="text-center text-gray-400 py-4">Loading deals...</p>
                                    ) : deals.length === 0 ? (
                                        <div className="bg-gray-700 p-6 rounded-lg">
                                            <p className="text-gray-300 text-center">
                                                You don't have any active deals yet.
                                            </p>
                                            <button 
                                                className="mt-4 mx-auto block bg-green-600 hover:bg-green-500 text-white py-2 px-6 rounded transition-colors"
                                                onClick={() => setActiveTab('sellers')}
                                            >
                                                Find Sellers
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {deals.map((deal) => (
                                                <div key={deal._id} className="bg-gray-700 p-4 rounded-lg">
                                                    <h3 className="text-xl font-semibold text-white">{deal.title}</h3>
                                                    <p className="text-gray-300 mt-2">{deal.description}</p>
                                                    <p className="text-gray-300 mt-2">
                                                        <span className="font-medium">Price:</span> ${deal.price}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="font-medium">Status:</span> 
                                                        <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                                            deal.status === 'active' ? 'bg-green-500' :
                                                            deal.status === 'pending' ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                        }`}>
                                                            {deal.status}
                                                        </span>
                                                    </p>
                                                    <button 
                                                        className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
                                                        onClick={() => navigate(`/deals/${deal._id}`)}
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Seller View (unchanged)
                        <div>
                            <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-2">
                                Your Deals
                            </h2>
                            {deals.length === 0 ? (
                                <div className="bg-gray-700 p-6 rounded-lg">
                                    <p className="text-gray-300 text-center">
                                        You don't have any active deals yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {deals.map((deal) => (
                                        <div key={deal._id} className="bg-gray-700 p-4 rounded-lg">
                                            <h3 className="text-xl font-semibold text-white">{deal.title}</h3>
                                            <p className="text-gray-300 mt-2">{deal.description}</p>
                                            <p className="text-gray-300 mt-2">
                                                <span className="font-medium">Price:</span> ${deal.price}
                                            </p>
                                            <p className="text-gray-300">
                                                <span className="font-medium">Status:</span> 
                                                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                                                    deal.status === 'active' ? 'bg-green-500' :
                                                    deal.status === 'pending' ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                                }`}>
                                                    {deal.status}
                                                </span>
                                            </p>
                                            <button 
                                                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded transition-colors"
                                                onClick={() => navigate(`/deals/${deal._id}`)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashBoard;