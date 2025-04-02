import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/Appcontext";
import { createDeal, getUserDeals } from "../services/api";

const Deals = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AppContext);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: "",
    description: "",
    price: "",
    status: "Pending",
    sellerId: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sellerId = queryParams.get("sellerId");

    if (sellerId) {
      setNewDeal((prev) => ({ ...prev, sellerId }));
      setShowCreateForm(true);
    }

    loadDeals();
  }, [location.search]);

  const loadDeals = async () => {
    try {
      const response = await getUserDeals();
      setDeals(response.deals);
    } catch (error) {
      setError("Failed to load deals. Please try again.");
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const response = await createDeal({
        ...newDeal,
        buyerId: user._id,
        price: parseFloat(newDeal.price),
      });

      if (response.success) {
        setDeals([...deals, response.deal]);
        setNewDeal({
          title: "",
          description: "",
          price: "",
          status: "active",
          sellerId: "",
        });
        setShowCreateForm(false);
        setSuccess("Deal created successfully!");
        setError("");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(
          response.message || "Failed to create deal. Please try again."
        );
      }
    } catch (error) {
      setError("Failed to create deal. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Deals</h1>
          {user?.role === "buyer" && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md"
            >
              {showCreateForm ? "Cancel" : "Create New Deal"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-600 text-white px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-600 text-white px-4 py-2 rounded mb-4">
            {success}
          </div>
        )}

        {showCreateForm && user?.role === "buyer" && (
          <form
            onSubmit={handleCreateDeal}
            className="bg-gray-800 p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-xl font-semibold mb-4">Create New Deal</h2>

            {newDeal.sellerId && (
              <p className="text-gray-300 mb-4">
                Creating deal with selected seller
              </p>
            )}

            <input
              type="text"
              placeholder="Title"
              value={newDeal.title}
              onChange={(e) =>
                setNewDeal({ ...newDeal, title: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              required
            />

            <textarea
              placeholder="Description"
              value={newDeal.description}
              onChange={(e) =>
                setNewDeal({ ...newDeal, description: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={newDeal.price}
              onChange={(e) =>
                setNewDeal({ ...newDeal, price: e.target.value })
              }
              className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              required
              min="0"
              step="0.01"
            />

            {!newDeal.sellerId && (
              <select
                value={newDeal.sellerId}
                onChange={(e) =>
                  setNewDeal({ ...newDeal, sellerId: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                required
              >
                <option value="">Select a seller</option>
              </select>
            )}

            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
            >
              Create Deal
            </button>
          </form>
        )}

        <h1>Your Deals</h1>
        {loading ? (
          <p className="text-center text-gray-400 py-4">Loading deals...</p>
        ) : deals.length === 0 ? (
          <div className="bg-gray-700 p-6 rounded-lg">
            <p className="text-gray-300 text-center">
              You don't have any active deals yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deals.map((deal) => (
              <div key={deal._id} className="bg-gray-700 p-4 rounded-lg">
                <h3 className="text-xl font-semibold text-white">
                  {deal.title}
                </h3>
                <p className="text-gray-300 mt-2">{deal.description}</p>
                <p className="text-gray-300 mt-2">
                  <span className="font-medium">Price:</span> ${deal.price}
                </p>
                <p className="text-gray-300">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-sm ${
                      deal.status === "In Progress"
                        ? "bg-green-500"
                        : deal.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {deal.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Deals;
