import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cms-rpx0.onrender.com/api';

export const fetchAllNotifications = createAsyncThunk(
  'notifications/fetchAllNotifications',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("We are Good!");
      return response.data;
    } catch (error) {
      console.error('Fetch notifications error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return { notificationId, message: response.data.message };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to mark notification as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`${API_URL}/notifications/${notificationId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return { notificationId, message: response.data.message };
    } catch (error) {
      console.error('Delete notification error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    loaded: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.loaded = true;
      })
      .addCase(fetchAllNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notifications.findIndex(n => n.NotificationId === action.payload.notificationId);
        if (index !== -1) {
          state.notifications[index].ReadStatus = true;
        }
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = state.notifications.filter(n => n.NotificationId !== action.payload.notificationId);
      });
  },
});

export default notificationSlice.reducer;