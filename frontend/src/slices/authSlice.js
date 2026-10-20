import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to login');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const config = userData instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : { headers: { 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_URL}/auth/register`, userData, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to register');
  }
});

export const verifyEmail = createAsyncThunk('auth/verifyEmail', async (token, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify?token=${token}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to verify email');
  }
});

export const resendVerification = createAsyncThunk('auth/resendVerification', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/resend-verification`, { email });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to resend verification email');
  }
});

export const createInvitations = createAsyncThunk('auth/createInvitations', async (invitations, { getState, rejectWithValue }) => {
  try {
    const { auth: { token } } = getState();
    if (!token) {
      return rejectWithValue('No authentication token found');
    }
    const response = await axios.post(`${API_URL}/auth/invitations/bulk`, invitations, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to send invitations');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    verified: false,
    invitationStatus: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.verified = false;
      state.invitationStatus = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.verified = action.payload.user.verified;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = false; // User must verify email first
        state.verified = action.payload.user.verified;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.verified = true;
        state.user = { ...state.user, verified: true };
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createInvitations.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.invitationStatus = null;
      })
      .addCase(createInvitations.fulfilled, (state, action) => {
        state.loading = false;
        state.invitationStatus = action.payload.message || 'Invitations sent successfully';
      })
      .addCase(createInvitations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.invitationStatus = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;