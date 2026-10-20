import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchAllLicenses = createAsyncThunk(
  'licenses/fetchAllLicenses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/licenses`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      console.log('Response is:', response);
      return response.data;
    } catch (error) {
      console.error('Fetch all licenses error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch licenses');
    }
  }
);

export const fetchLicenses = createAsyncThunk(
  'licenses/fetchLicenses',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.get(`${API_URL}/companies/${companyId}/licenses`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Fetch licenses error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch licenses');
    }
  }
);

export const createLicense = createAsyncThunk(
  'licenses/createLicense',
  async (licenseData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.post(`${API_URL}/licenses`, licenseData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Create license error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create license');
    }
  }
);

export const updateLicense = createAsyncThunk(
  'licenses/updateLicense',
  async ({ licenseId, licenseData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await axios.put(`${API_URL}/licenses/${licenseId}`, licenseData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Update license error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update license');
    }
  }
);

export const deleteLicense = createAsyncThunk(
  'licenses/deleteLicense',
  async (licenseId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      await axios.delete(`${API_URL}/licenses/${licenseId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return licenseId;
    } catch (error) {
      console.error('Delete license error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete license');
    }
  }
);

const licenseSlice = createSlice({
  name: 'licenses',
  initialState: {
    licenses: [],
    currentLicense: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLicenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllLicenses.fulfilled, (state, action) => {
        state.loading = false;
        state.licenses = action.payload;
      })
      .addCase(fetchAllLicenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLicenses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLicenses.fulfilled, (state, action) => {
        state.loading = false;
        state.licenses = action.payload;
      })
      .addCase(fetchLicenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLicense.fulfilled, (state, action) => {
        // Update licenses list after creation
        state.licenses.push({
          LicenseId: action.payload.licenseId,
          ...action.meta.arg,
        });
      })
      .addCase(updateLicense.fulfilled, (state, action) => {
        const index = state.licenses.findIndex((l) => l.LicenseId === action.meta.arg.licenseId);
        if (index !== -1) {
          state.licenses[index] = { LicenseId: action.meta.arg.licenseId, ...action.meta.arg.licenseData };
        }
      })
      .addCase(deleteLicense.fulfilled, (state, action) => {
        state.licenses = state.licenses.filter((l) => l.LicenseId !== action.payload);
      });
  },
});

export default licenseSlice.reducer;