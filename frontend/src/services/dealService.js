import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/deals`;

export const getAllDeals = async () => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getAllDeals:', error);
    throw error;
  }
};

export const createDeal = async (dealData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, dealData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in createDeal:', error);
    throw error;
  }
};

export const getDealById = async (dealId) => {
  try {
    const response = await axios.get(`${API_URL}/deals/${dealId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error in getDealById:', error);
    throw error;
  }
};

export const updateDealStatus = async (dealId, status) => {
  try {
    const response = await axios.put(
      `${API_URL}/deals/${dealId}/update-status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in updateDealStatus:', error);
    throw error;
  }
};

export const updateDealPrice = async (dealId, price) => {
  try {
    const response = await axios.patch(
      `${API_URL}/deals/${dealId}/price`,
      { price },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in updateDealPrice:', error);
    throw error;
  }
};

const getDealsByRole = async (role) => {
  const response = await axios.get(`${API_URL}/deals/role/${role}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

const dealService = {
  getAllDeals,
  createDeal,
  getDealById,
  updateDealStatus,
  updateDealPrice,
  getDealsByRole,
};

export default dealService; 