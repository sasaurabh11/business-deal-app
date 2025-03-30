import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/Appcontext';
import { getAllDeals } from '../services/dealService';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Analytics = () => {
  const { user } = useContext(AppContext);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await getAllDeals();
      setDeals(response.deals);
    } catch (error) {
      setError('Failed to load analytics data. Please try again.');
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
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

  // Calculate analytics data
  const totalDeals = deals.length;
  const activeDeals = deals.filter(deal => deal.status === 'active').length;
  const pendingDeals = deals.filter(deal => deal.status === 'pending').length;
  const completedDeals = deals.filter(deal => deal.status === 'completed').length;
  
  const totalValue = deals.reduce((sum, deal) => sum + deal.price, 0);
  const averageDealValue = totalValue / totalDeals;

  // Status distribution chart data
  const statusData = {
    labels: ['Active', 'Pending', 'Completed'],
    datasets: [
      {
        data: [activeDeals, pendingDeals, completedDeals],
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(234, 179, 8, 0.5)',
          'rgba(59, 130, 246, 0.5)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Deal value distribution chart data
  const valueData = {
    labels: deals.map(deal => deal.title),
    datasets: [
      {
        label: 'Deal Value ($)',
        data: deals.map(deal => deal.price),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Total Deals</h3>
          <p className="text-2xl font-bold">{totalDeals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Active Deals</h3>
          <p className="text-2xl font-bold text-green-600">{activeDeals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Pending Deals</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingDeals}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-gray-500 text-sm">Completed Deals</h3>
          <p className="text-2xl font-bold text-blue-600">{completedDeals}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Deal Status Distribution</h2>
          <div className="h-80">
            <Pie data={statusData} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Deal Values</h2>
          <div className="h-80">
            <Bar
              data={valueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Financial Overview</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Total Deal Value:</span>
              <span className="font-semibold">${totalValue.toLocaleString()}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Average Deal Value:</span>
              <span className="font-semibold">${averageDealValue.toLocaleString()}</span>
            </p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Deal Completion Rate</h3>
          <div className="space-y-2">
            <p className="flex justify-between">
              <span className="text-gray-600">Completion Rate:</span>
              <span className="font-semibold">
                {((completedDeals / totalDeals) * 100).toFixed(1)}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600">Active Rate:</span>
              <span className="font-semibold">
                {((activeDeals / totalDeals) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 