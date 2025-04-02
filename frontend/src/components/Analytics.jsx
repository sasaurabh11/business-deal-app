import React, { useState, useEffect, useContext } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { dealsStats, userStatsapi } from "../services/api";
import {
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import { AppContext } from "../context/Appcontext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsDashboard = () => {
  const { isDarkMode } = useContext(AppContext); // Get theme from context
  const [dealStats, setDealStats] = useState({
    pendingDeals: 0,
    completedDeals: 0,
    InProgressDeals: 0,
    CancelledDeals: 0,
  });
  const [userStats, setUserStats] = useState({
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dealsResponse, usersResponse] = await Promise.all([
          dealsStats(),
          userStatsapi(),
        ]);

        if (dealsResponse.success) setDealStats(dealsResponse.data);
        if (usersResponse.success) setUserStats(usersResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dealStatusData = {
    labels: ["Pending", "Completed", "In Progress", "Cancelled"],
    datasets: [
      {
        label: "Deal Status",
        data: [
          dealStats.pendingDeals,
          dealStats.completedDeals,
          dealStats.InProgressDeals,
          dealStats.CancelledDeals,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const userEngagementData = {
    labels: ["Active Users"],
    datasets: [
      {
        label: "User Engagement",
        data: [userStats.activeUsers],
        backgroundColor: "rgba(59, 130, 246, 0.7)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
    ],
  };

  const totalDeals =
    dealStats.pendingDeals +
    dealStats.completedDeals +
    dealStats.InProgressDeals +
    dealStats.CancelledDeals;
  if (totalDeals === 0) return "0%";
  const completionRate = Math.round(
    (dealStats.completedDeals / totalDeals) * 100
  );

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p
            className={`mt-4 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Loading dashboard...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg max-w-md w-full`}
        >
          <div className="text-red-500 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="text-xl font-bold mt-4">Error Loading Data</h3>
            <p className="mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={`mt-4 px-4 py-2 rounded-md ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white transition-colors`}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p
              className={`mt-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Overview of your platform's performance
            </p>
          </div>
          <div
            className={`mt-4 md:mt-0 px-4 py-2 rounded-full ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-sm`}
          >
            <span className="flex items-center">
              <span
                className={`mr-2 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Last updated:
              </span>
              <span className="font-medium">{new Date().toLocaleString()}</span>
            </span>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? "bg-blue-900" : "bg-blue-100"
                } mr-4`}
              >
                <FiTrendingUp
                  className={`text-2xl ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Total Deals
                </p>
                <p className="text-2xl font-bold">{totalDeals}</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? "bg-green-900" : "bg-green-100"
                } mr-4`}
              >
                <FiActivity
                  className={`text-2xl ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">{completionRate}%</p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center">
              <div
                className={`p-3 rounded-full ${
                  isDarkMode ? "bg-purple-900" : "bg-purple-100"
                } mr-4`}
              >
                <FiUsers
                  className={`text-2xl ${
                    isDarkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Active Users
                </p>
                <p className="text-2xl font-bold">{userStats.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Deal Statistics */}
          <div
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center mb-6">
              <FiPieChart
                className={`text-xl mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <h2 className="text-xl font-semibold">
                Deal Status Distribution
              </h2>
            </div>
            <div className="h-80">
              <Pie
                data={dealStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        color: isDarkMode ? "#E5E7EB" : "#374151",
                        font: {
                          size: 14,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-red-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Pending
                </p>
                <p
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {dealStats.pendingDeals}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-blue-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Completed
                </p>
                <p
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {dealStats.completedDeals}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-yellow-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  In Progress
                </p>
                <p
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-yellow-400" : "text-yellow-600"
                  }`}
                >
                  {dealStats.InProgressDeals}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode ? "bg-gray-700" : "bg-green-50"
                }`}
              >
                <p
                  className={`text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Cancelled
                </p>
                <p
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  {dealStats.CancelledDeals}
                </p>
              </div>
            </div>
          </div>

          {/* User Engagement */}
          <div
            className={`p-6 rounded-xl shadow-md ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex items-center mb-6">
              <FiBarChart2
                className={`text-xl mr-2 ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              />
              <h2 className="text-xl font-semibold">User Engagement</h2>
            </div>
            <div className="h-80">
              <Bar
                data={userEngagementData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: isDarkMode ? "#E5E7EB" : "#374151",
                      },
                      grid: {
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      },
                    },
                    x: {
                      ticks: {
                        color: isDarkMode ? "#E5E7EB" : "#374151",
                      },
                      grid: {
                        color: isDarkMode
                          ? "rgba(255, 255, 255, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      },
                    },
                  },
                }}
              />
            </div>
            <div
              className={`mt-6 p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Active Users
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    {userStats.activeUsers}
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full ${
                    isDarkMode ? "bg-blue-900" : "bg-blue-100"
                  } text-sm font-medium ${
                    isDarkMode ? "text-blue-300" : "text-blue-700"
                  }`}
                >
                  {totalDeals > 0
                    ? Math.round((userStats.activeUsers / totalDeals) * 100)
                    : 0}
                  % of total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Section */}
        <div
          className={`p-6 rounded-xl shadow-md ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } mb-8`}
        >
          <h2 className="text-xl font-semibold mb-6">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Avg. Completion Time
              </p>
              <p className="text-xl font-bold">--</p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Not tracked yet
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Conversion Rate
              </p>
              <p className="text-xl font-bold">--</p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Not tracked yet
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                User Retention
              </p>
              <p className="text-xl font-bold">--</p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Not tracked yet
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-700" : "bg-gray-50"
              }`}
            >
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Revenue Generated
              </p>
              <p className="text-xl font-bold">--</p>
              <p
                className={`text-xs mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Not tracked yet
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
