import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://cms-rpx0.onrender.com/api';

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchDashboardStats',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/dashboard/stats`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch dashboard stats error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
);

export const fetchRecentActivities = createAsyncThunk(
  'dashboard/fetchRecentActivities',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/dashboard/activities`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch recent activities error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent activities');
    }
  }
);

export const fetchCompanyRegistrations = createAsyncThunk(
  'dashboard/fetchCompanyRegistrations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/dashboard/company-registrations`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch company registrations error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company registrations');
    }
  }
);

export const fetchLicenseDistribution = createAsyncThunk(
  'dashboard/fetchLicenseDistribution',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/dashboard/license-distribution`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch license distribution error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch license distribution');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: [],
    activities: [],
    companyRegistrations: { labels: [], datasets: [] },
    licenseDistribution: { labels: [], data: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompanyRegistrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyRegistrations.fulfilled, (state, action) => {
        state.loading = false;
        state.companyRegistrations = action.payload;
      })
      .addCase(fetchCompanyRegistrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLicenseDistribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLicenseDistribution.fulfilled, (state, action) => {
        state.loading = false;
        state.licenseDistribution = action.payload;
      })
      .addCase(fetchLicenseDistribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;