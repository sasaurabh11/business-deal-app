import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with auth header
const axiosAuth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createDeal = createAsyncThunk(
  'deals/create',
  async (dealData, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.post('/deals', dealData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDeals = createAsyncThunk(
  'deals/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get('/deals');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDeal = createAsyncThunk(
  'deals/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get(`/deals/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDealPrice = createAsyncThunk(
  'deals/updatePrice',
  async ({ id, newPrice }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.put(`/deals/${id}/price`, { newPrice });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDealStatus = createAsyncThunk(
  'deals/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.put(`/deals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadDocument = createAsyncThunk(
  'deals/uploadDocument',
  async ({ dealId, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      const response = await axiosAuth.post(`/documents/${dealId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  deals: [],
  currentDeal: null,
  loading: false,
  error: null,
};

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Deal
      .addCase(createDeal.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.deals.push(action.payload);
      })
      .addCase(createDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get All Deals
      .addCase(getDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(getDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Single Deal
      .addCase(getDeal.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDeal.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDeal = action.payload;
      })
      .addCase(getDeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Deal Price
      .addCase(updateDealPrice.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDealPrice.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex((deal) => deal._id === action.payload._id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        if (state.currentDeal?._id === action.payload._id) {
          state.currentDeal = action.payload;
        }
      })
      .addCase(updateDealPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Update Deal Status
      .addCase(updateDealStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDealStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.deals.findIndex((deal) => deal._id === action.payload._id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
        if (state.currentDeal?._id === action.payload._id) {
          state.currentDeal = action.payload;
        }
      })
      .addCase(updateDealStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Upload Document
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentDeal?._id === action.payload._id) {
          state.currentDeal = action.payload;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError } = dealSlice.actions;
export default dealSlice.reducer; 