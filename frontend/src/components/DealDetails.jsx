import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDealById, updateDealStatus, updateDealPrice } from '../services/dealService';
import Chat from './Chat';
import Documents from './Documents';

const DealDetails = () => {
  const { dealId } = useParams();
  const { user } = useContext(AppContext);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDeal, setEditedDeal] = useState(null);

  useEffect(() => {
    loadDealDetails();
  }, [dealId]);

  const loadDealDetails = async () => {
    try {
      const response = await getDealById(dealId);
      setDeal(response.deal);
      setEditedDeal(response.deal);
    } catch (error) {
      setError('Failed to load deal details. Please try again.');
      console.error('Error loading deal details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await updateDealStatus(dealId, newStatus);
      if (response.success) {
        setDeal({ ...deal, status: newStatus });
      } else {
        setError('Failed to update deal status. Please try again.');
      }
    } catch (error) {
      setError('Failed to update deal status. Please try again.');
      console.error('Error updating deal status:', error);
    }
  };

  const handlePriceUpdate = async (newPrice) => {
    try {
      const response = await updateDealPrice(dealId, newPrice);
      if (response.success) {
        setDeal({ ...deal, price: newPrice });
      } else {
        setError('Failed to update deal price. Please try again.');
      }
    } catch (error) {
      setError('Failed to update deal price. Please try again.');
      console.error('Error updating deal price:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await updateDeal(dealId, editedDeal);
      if (response.success) {
        setDeal(editedDeal);
        setIsEditing(false);
      } else {
        setError('Failed to update deal. Please try again.');
      }
    } catch (error) {
      setError('Failed to update deal. Please try again.');
      console.error('Error updating deal:', error);
    }
  };

  const handleCancel = () => {
    setEditedDeal(deal);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="p-4">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Deal not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editedDeal.title}
                  onChange={(e) => setEditedDeal({ ...editedDeal, title: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  value={editedDeal.description}
                  onChange={(e) => setEditedDeal({ ...editedDeal, description: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  value={editedDeal.price}
                  onChange={(e) => setEditedDeal({ ...editedDeal, price: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-2">{deal.title}</h1>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xl font-bold">${deal.price}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      deal.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : deal.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {deal.status}
                  </span>
                </div>
                {user._id === deal.createdBy && (
                  <button
                    onClick={handleEdit}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit Deal
                  </button>
                )}
              </>
            )}
          </div>
          {user.role === 'seller' && deal.status === 'active' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('pending')}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Mark as Pending
              </button>
            </div>
          )}
          {user.role === 'seller' && deal.status === 'pending' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusUpdate('completed')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Mark as Completed
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'chat'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Chat
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === 'documents'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
          </nav>
        </div>
        <div className="p-4">
          {activeTab === 'chat' && <Chat dealId={dealId} />}
          {activeTab === 'documents' && <Documents dealId={dealId} />}
        </div>
      </div>
    </div>
  );
};

export default DealDetails; 