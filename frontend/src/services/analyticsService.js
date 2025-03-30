import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const analyticsService = {
  // Get deal statistics
  getDealStats: async () => {
    const response = await axios.get(`${API_URL}/analytics/deals`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get user engagement metrics
  getUserEngagement: async () => {
    const response = await axios.get(`${API_URL}/analytics/engagement`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get document usage statistics
  getDocumentStats: async () => {
    const response = await axios.get(`${API_URL}/analytics/documents`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },

  // Get chat activity metrics
  getChatActivity: async () => {
    const response = await axios.get(`${API_URL}/analytics/chat`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  },
};

export default analyticsService; 