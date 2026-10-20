import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { logout } from './authSlice';
import { message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || 'https://cms-rpx0.onrender.com/api';

export const fetchOrgStructures = createAsyncThunk(
  'orgStructures/fetchOrgStructures',
  async ({ companyId }, { getState, rejectWithValue, dispatch }) => {
    try {
      if (!companyId || companyId === 'undefined' || companyId === ':companyId') {
        throw new Error('Invalid company ID');
      }
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.get(`${API_URL}/companies/${companyId}/orgChart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data) {
        throw new Error('No data received from server');
      }
      return { companyId, structures: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.message || error.response?.data?.error || 'Failed to fetch organizational structures');
    }
  }
);

export const createOrgStructure = createAsyncThunk(
  'orgStructures/createOrgStructure',
  async ({ companyId, data }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.post(`${API_URL}/orgStructures`, {
        ...data,
        CompanyId: companyId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Organization structure created successfully');
      return { companyId, structure: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to create organizational structure');
    }
  }
);

export const updateOrgStructure = createAsyncThunk(
  'orgStructures/updateOrgStructure',
  async ({ orgStructureId, companyId, data }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.put(`${API_URL}/orgStructures/${orgStructureId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Organization structure updated successfully');
      return { companyId, structure: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to update organizational structure');
    }
  }
);

export const deleteOrgStructure = createAsyncThunk(
  'orgStructures/deleteOrgStructure',
  async ({ orgStructureId, companyId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      await axios.delete(`${API_URL}/orgStructures/${orgStructureId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Organization structure deleted successfully');
      return { companyId, orgStructureId };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to delete organizational structure');
    }
  }
);

export const assignUserToOrgStructure = createAsyncThunk(
  'orgStructures/assignUser',
  async ({ orgStructureId, userId, roleId, companyId }, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.post(`${API_URL}/orgStructures/assign`, {
        OrgStructureId: orgStructureId,
        UserId: userId,
        RoleId: roleId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('User assigned to organizational unit');
      return { companyId, structure: response.data };
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to assign user to organizational unit');
    }
  }
);

export const fetchOrgStructureHistory = createAsyncThunk(
  'orgStructures/fetchHistory',
  async (orgStructureId, { getState, rejectWithValue, dispatch }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) {
        dispatch(logout());
        return rejectWithValue('Authentication token is missing');
      }
      const response = await axios.get(`${API_URL}/orgStructures/${orgStructureId}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(logout());
        return rejectWithValue('Session expired. Please log in again.');
      }
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch structure history');
    }
  }
);

const initialState = {
  byCompanyId: {},
  currentCompanyId: null,
  orgStructures: [],
  history: {
    list: [],
    loading: false,
    error: null
  },
  currentStructure: null,
  loading: false,
  error: null,
  assignUserLoading: false,
  assignUserError: null
};

const orgStructureSlice = createSlice({
  name: 'orgStructures',
  initialState,
  reducers: {
    clearOrgStructureState: (state) => {
      state.byCompanyId = {};
      state.orgStructures = [];
      state.currentStructure = null;
      state.currentCompanyId = null;
      state.error = null;
    },
    setCurrentStructure: (state, action) => {
      state.currentStructure = action.payload;
    },
    setCurrentCompanyId: (state, action) => {
      state.currentCompanyId = action.payload;
      state.orgStructures = state.byCompanyId[action.payload]?.structures || [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrgStructures.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrgStructures.fulfilled, (state, action) => {
        state.loading = false;
        const { companyId, structures } = action.payload;
        state.byCompanyId[companyId] = { structures: Array.isArray(structures) ? structures : [] };
        state.currentCompanyId = companyId;
        state.orgStructures = Array.isArray(structures) ? structures : [];
      })
      .addCase(fetchOrgStructures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrgStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrgStructure.fulfilled, (state, action) => {
        state.loading = false;
        const { companyId, structure } = action.payload;
        if (state.byCompanyId[companyId]) {
          state.byCompanyId[companyId].structures.push(structure);
        } else {
          state.byCompanyId[companyId] = { structures: [structure] };
        }
        if (state.currentCompanyId === companyId) {
          state.orgStructures = state.byCompanyId[companyId].structures;
        }
      })
      .addCase(createOrgStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrgStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrgStructure.fulfilled, (state, action) => {
        state.loading = false;
        const { companyId, structure } = action.payload;
        if (state.byCompanyId[companyId]) {
          const index = state.byCompanyId[companyId].structures.findIndex(
            s => s.OrgStructureId === structure.OrgStructureId
          );
          if (index !== -1) {
            state.byCompanyId[companyId].structures[index] = structure;
          }
          if (state.currentCompanyId === companyId) {
            state.orgStructures = state.byCompanyId[companyId].structures;
          }
        }
      })
      .addCase(updateOrgStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrgStructure.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrgStructure.fulfilled, (state, action) => {
        state.loading = false;
        const { companyId, orgStructureId } = action.payload;
        if (state.byCompanyId[companyId]) {
          state.byCompanyId[companyId].structures = state.byCompanyId[companyId].structures.filter(
            s => s.OrgStructureId !== orgStructureId
          );
          if (state.currentCompanyId === companyId) {
            state.orgStructures = state.byCompanyId[companyId].structures;
          }
        }
      })
      .addCase(deleteOrgStructure.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(assignUserToOrgStructure.pending, (state) => {
        state.assignUserLoading = true;
        state.assignUserError = null;
      })
      .addCase(assignUserToOrgStructure.fulfilled, (state, action) => {
        state.assignUserLoading = false;
        const { companyId, structure } = action.payload;
        if (state.byCompanyId[companyId]) {
          const index = state.byCompanyId[companyId].structures.findIndex(
            s => s.OrgStructureId === action.meta.arg.orgStructureId
          );
          if (index !== -1) {
            state.byCompanyId[companyId].structures[index] = {
              ...state.byCompanyId[companyId].structures[index],
              users: [...(state.byCompanyId[companyId].structures[index].users || []), structure.user]
            };
          }
          if (state.currentCompanyId === companyId) {
            state.orgStructures = state.byCompanyId[companyId].structures;
          }
        }
      })
      .addCase(assignUserToOrgStructure.rejected, (state, action) => {
        state.assignUserLoading = false;
        state.assignUserError = action.payload;
      })
      .addCase(fetchOrgStructureHistory.pending, (state) => {
        state.history.loading = true;
        state.history.error = null;
      })
      .addCase(fetchOrgStructureHistory.fulfilled, (state, action) => {
        state.history.loading = false;
        state.history.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchOrgStructureHistory.rejected, (state, action) => {
        state.history.loading = false;
        state.history.error = action.payload;
      });
  }
});

export const { clearOrgStructureState, setCurrentStructure, setCurrentCompanyId } = orgStructureSlice.actions;
export default orgStructureSlice.reducer;