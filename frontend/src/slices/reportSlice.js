import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchDesignationSummary = createAsyncThunk(
  'reports/fetchDesignationSummary',
  async (companyId = null, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/reports/designation-summary`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: { companyId },
      });

      console.log("Response......", response);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to fetch data');
      }
      
      return response.data.data;
    } catch (error) {
      console.error('Fetch designation summary error:', error);
      return rejectWithValue(
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch designation summary'
      );
    }
  }
);


const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    designationSummary: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignationSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignationSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.designationSummary = action.payload; // Already an array
      })
      .addCase(fetchDesignationSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.designationSummary = []; // Reset to empty array on error
      });
  },
});

export default reportSlice.reducer;