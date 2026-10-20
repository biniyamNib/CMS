import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAllDesignations = createAsyncThunk(
  'designations/fetchAllDesignations',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/designations`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch designations error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch designations');
    }
  }
);

export const createDesignation = createAsyncThunk(
  'designations/createDesignation',
  async (designationData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/designations`, designationData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log("Response:", response);
      return response.data;
    } catch (error) {
      console.error('Create designation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create designation');
    }
  }
);

export const updateDesignation = createAsyncThunk(
  'designations/updateDesignation',
  async ({ designationId, designationData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/designations/${designationId}`, designationData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Update designation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update designation');
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  'designations/deleteDesignation',
  async (designationId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.delete(`${API_URL}/designations/${designationId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return { designationId, message: response.data.message };
    } catch (error) {
      console.error('Delete designation error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete designation');
    }
  }
);

const designationSlice = createSlice({
  name: 'designations',
  initialState: {
    designations: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
      })
      .addCase(fetchAllDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations.push(action.payload);
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.designations.findIndex(d => d.DesignationId === action.meta.arg.designationId);
        if (index !== -1) {
          state.designations[index] = { ...state.designations[index], ...action.meta.arg.designationData };
        }
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = state.designations.filter(d => d.DesignationId !== action.payload.designationId);
      });
  },
});

export default designationSlice.reducer;