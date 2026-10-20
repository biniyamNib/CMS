import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { message } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cms-rpx0.onrender.com/api';

export const fetchShareholders = createAsyncThunk(
  'shareholders/fetchShareholders',
  async ({ companyId } = {}, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.get(`${API_BASE_URL}/shareholders`, {
        params: { companyId },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shareholders');
    }
  }
);

export const fetchShareholder = createAsyncThunk(
  'shareholders/fetchShareholder',
  async (shareholderId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.get(`${API_BASE_URL}/shareholders/${shareholderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shareholder');
    }
  }
);

export const createShareholder = createAsyncThunk(
  'shareholders/createShareholder',
  async (data, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.post(`${API_BASE_URL}/shareholders`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create shareholder');
    }
  }
);

export const updateShareholder = createAsyncThunk(
  'shareholders/updateShareholder',
  async ({ shareholderId, data }, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.put(`${API_BASE_URL}/shareholders/${shareholderId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update shareholder');
    }
  }
);

export const deleteShareholder = createAsyncThunk(
  'shareholders/deleteShareholder',
  async (shareholderId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.delete(`${API_BASE_URL}/shareholders/${shareholderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { shareholderId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete shareholder');
    }
  }
);

export const assignShareholderToCompany = createAsyncThunk(
  'shareholders/assignShareholderToCompany',
  async (data, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.post(`${API_BASE_URL}/shareholders/assign`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign shareholder');
    }
  }
);

export const fetchShareholderHistory = createAsyncThunk(
  'shareholders/fetchShareholderHistory',
  async (shareholderId, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      const response = await axios.get(`${API_BASE_URL}/shareholders/${shareholderId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shareholder history');
    }
  }
);

const initialState = {
  shareholders: [],
  currentShareholder: null,
  history: [],
  loading: false,
  error: null,
};

const shareholderSlice = createSlice({
  name: 'shareholders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentShareholder: (state) => {
      state.currentShareholder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Shareholders
      .addCase(fetchShareholders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShareholders.fulfilled, (state, action) => {
        state.loading = false;
        state.shareholders = action.payload;
      })
      .addCase(fetchShareholders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })
      // Fetch Shareholder
      .addCase(fetchShareholder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShareholder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShareholder = action.payload;
      })
      .addCase(fetchShareholder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentShareholder = null;
        if (action.payload.includes('not found')) {
          message.warning('Shareholder not found');
        } else {
          message.error(action.payload);
        }
      })
      // Create Shareholder
      .addCase(createShareholder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShareholder.fulfilled, (state, action) => {
        state.loading = false;
        state.shareholders.push({ ShareholderId: action.payload.ShareholderId, ShareholderName: action.meta.arg.ShareholderName });
        message.success('Shareholder created successfully');
      })
      .addCase(createShareholder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })
      // Update Shareholder
      .addCase(updateShareholder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShareholder.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shareholders.findIndex((s) => s.ShareholderId === action.meta.arg.shareholderId);
        if (index !== -1) {
          state.shareholders[index] = { ...state.shareholders[index], ...action.meta.arg.data };
        }
        if (state.currentShareholder && state.currentShareholder.ShareholderId === action.meta.arg.shareholderId) {
          state.currentShareholder = { ...state.currentShareholder, ...action.meta.arg.data };
        }
        message.success('Shareholder updated successfully');
      })
      .addCase(updateShareholder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })
      // Delete Shareholder
      .addCase(deleteShareholder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShareholder.fulfilled, (state, action) => {
        state.loading = false;
        state.shareholders = state.shareholders.filter((s) => s.ShareholderId !== action.meta.arg);
        if (state.currentShareholder && state.currentShareholder.ShareholderId === action.meta.arg) {
          state.currentShareholder = null;
        }
        message.success(action.payload.message);
      })
      .addCase(deleteShareholder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })
      // Assign Shareholder to Company
      .addCase(assignShareholderToCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignShareholderToCompany.fulfilled, (state) => {
        state.loading = false;
        message.success('Shareholder assigned to company successfully');
      })
      .addCase(assignShareholderToCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      })
      // Fetch Shareholder History
      .addCase(fetchShareholderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShareholderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(fetchShareholderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        message.error(action.payload);
      });
  },
});

export const { clearError, clearCurrentShareholder } = shareholderSlice.actions;
export default shareholderSlice.reducer;