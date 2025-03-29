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

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ dealId, content }, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.post(`/chat/${dealId}/messages`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (dealId, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get(`/chat/${dealId}/messages`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markMessagesAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (dealId, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.put(`/chat/${dealId}/messages/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  'chat/getUnreadCount',
  async (dealId, { rejectWithValue }) => {
    try {
      const response = await axiosAuth.get(`/chat/${dealId}/unread-count`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  messages: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action) => {
      const message = state.messages.find((m) => m._id === action.payload.messageId);
      if (message) {
        message.isRead = action.payload.isRead;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Messages
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Mark Messages as Read
      .addCase(markMessagesAsRead.pending, (state) => {
        state.loading = true;
      })
      .addCase(markMessagesAsRead.fulfilled, (state) => {
        state.loading = false;
        state.messages.forEach((message) => {
          message.isRead = true;
        });
      })
      .addCase(markMessagesAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      // Get Unread Count
      .addCase(getUnreadCount.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(getUnreadCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { addMessage, updateMessageStatus, clearError } = chatSlice.actions;
export default chatSlice.reducer; 