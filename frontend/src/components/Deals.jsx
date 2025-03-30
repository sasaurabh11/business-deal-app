import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { getAllDeals, createDeal, updateDealStatus } from '../services/dealService';

const Deals = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [deals, setDeals] = useState([]);
  const [newDeal, setNewDeal] = useState({ title: '', description: '', price: '', status: 'active' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await getAllDeals();
      setDeals(response.deals);
    } catch (error) {
      setError('Failed to load deals. Please try again.');
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const response = await createDeal(newDeal);
      if (response.success) {
        setDeals([...deals, response.deal]);
        setNewDeal({ title: '', description: '', price: '', status: 'active' });
        setShowCreateForm(false);
      } else {
        setError('Failed to create deal. Please try again.');
      }
    } catch (error) {
      setError('Failed to create deal. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Deals</h1>
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md">
            {showCreateForm ? 'Cancel' : 'Create New Deal'}
          </button>
        </div>
        {error && <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">{error}</div>}

        {showCreateForm && (
          <form onSubmit={handleCreateDeal} className="bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Deal</h2>
            <input type="text" placeholder="Title" value={newDeal.title} onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })} className="w-full p-2 rounded bg-gray-700 text-white mb-4" required />
            <textarea placeholder="Description" value={newDeal.description} onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })} className="w-full p-2 rounded bg-gray-700 text-white mb-4" required />
            <input type="number" placeholder="Price" value={newDeal.price} onChange={(e) => setNewDeal({ ...newDeal, price: e.target.value })} className="w-full p-2 rounded bg-gray-700 text-white mb-4" required />
            <button type="submit" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">Create Deal</button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deals.map((deal) => (
            <div key={deal._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{deal.title}</h3>
              <p className="text-gray-400 mb-4">{deal.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">${deal.price}</span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${deal.status === 'active' ? 'bg-green-500' : deal.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}>{deal.status}</span>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => navigate(`/deals/${deal._id}`)} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">View</button>
                {user?.role === 'seller' && deal.status === 'active' && (
                  <button onClick={() => updateDealStatus(deal._id, 'pending')} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg">Mark Pending</button>
                )}
                {user?.role === 'seller' && deal.status === 'pending' && (
                  <button onClick={() => updateDealStatus(deal._id, 'completed')} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">Mark Completed</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deals;
