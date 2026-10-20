import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/roles`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch roles');
  }
});

export const fetchRole = createAsyncThunk('roles/fetchRole', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.get(`${API_URL}/roles/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch role');
  }
});

export const createRole = createAsyncThunk('roles/createRole', async (roleData, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.post(`${API_URL}/roles`, roleData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create role');
  }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ id, roleData }, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.patch(`${API_URL}/roles/${id}`, roleData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update role');
  }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth } = getState();
    const response = await axios.delete(`${API_URL}/roles/${id}`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    return { id, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete role');
  }
});

const roleSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    currentRole: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRole.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(fetchRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.roles = state.roles.filter((role) => role.RoleId !== action.payload.id);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage } = roleSlice.actions;
export default roleSlice.reducer;