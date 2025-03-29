import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dealReducer from './slices/dealSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    deals: dealReducer,
    chat: chatReducer,
  },
}); 