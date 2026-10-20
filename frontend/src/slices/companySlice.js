import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCompanies = createAsyncThunk(
  'company/fetchCompanies',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/companies`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch companies result:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch companies');
    }
  }
);

export const createCompany = createAsyncThunk(
  'company/createCompany',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(`${API_URL}/companies`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Create company result:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create company');
    }
  }
);

export const updateCompany = createAsyncThunk(
  'company/updateCompany',
  async ({ companyId, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${API_URL}/companies/${companyId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Update company result:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update company');
    }
  }
);

export const createSubCompany = createAsyncThunk(
  'company/createSubCompany',
  async ({ parentCompanyId, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.post(
        `${API_URL}/companies/${parentCompanyId}/sub-companies`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Create sub-company result:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Failed to create sub-company'
      );
    }
  }
);

export const fetchAuditLogs = createAsyncThunk(
  'company/fetchAuditLogs',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_URL}/companies/${companyId}/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetch audit logs result:', response.data);
      return { companyId, logs: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch audit logs');
    }
  }
);

export const deleteCompany = createAsyncThunk(
  'company/deleteCompany',
  async (companyId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${API_URL}/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { 
        companyId, 
        message: response.data.message,
        deletedCompanyName: response.data.deletedCompanyName
      };
    } catch (error) {
      console.error('API Error:', error.response?.data);
      
      // Custom handling for different error types
      let errorMessage = 'Failed to delete company';
      let details = error.response?.data?.error || error.message;
      
      if (error.response?.data?.details) {
        details = error.response.data.details;
      }
      
      if (error.response?.status === 400) {
        // Handle business logic errors (sub-companies or licenses exist)
        return rejectWithValue({
          message: error.response.data.error,
          details: error.response.data.details,
          subCompanies: error.response.data.subCompanies,
          licenses: error.response.data.licenses
        });
      } else if (error.response?.status === 403) {
        errorMessage = 'Unauthorized';
      } else if (error.response?.status === 404) {
        errorMessage = 'Company not found';
      }
      
      return rejectWithValue({
        message: errorMessage,
        details: details
      });
    }
  }
);

const companySlice = createSlice({
  name: 'company',
  initialState: {
    companies: [],
    auditLogs: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload;
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex((c) => c.CompanyId === action.payload.CompanyId);
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.push(action.payload);
        const parentIndex = state.companies.findIndex(
          (c) => c.CompanyId === action.payload.ParentCompanyId
        );
        if (parentIndex !== -1) {
          state.companies[parentIndex].SubCompanies = state.companies[parentIndex].SubCompanies || [];
          state.companies[parentIndex].SubCompanies.push(action.payload);
        }
      })
      .addCase(createSubCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs[action.payload.companyId] = action.payload.logs;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company.CompanyId !== action.payload.companyId
        );
      })
      .addCase(deleteCompany.rejected, (state, action) => {
      state.loading = false;
      // Use the structured error message if available
      if (action.payload) {
        state.error = {
          message: action.payload.message,
          details: action.payload.details,
          subCompanies: action.payload.subCompanies,
          licenses: action.payload.licenses
        };
      } else {
        state.error = {
          message: 'Failed to delete company',
          details: action.error.message
        };
      }
      });
  },
});

export const { clearError } = companySlice.actions;
export default companySlice.reducer;
