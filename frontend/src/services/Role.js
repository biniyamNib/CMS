import axios from 'axios';

const API_URL = 'http://localhost:5000/api/roles';

export const getRoles = async () => {
    try {
    const response = await axios.get(API_URL);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch roles' };
    }
};

export const addRole = async (roleData) => {
    try {
    const response = await axios.post(API_URL, roleData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to add role' };
    }
};

export const updateRole = async (id, roleData) => {
    try {
    const response = await axios.put(`${API_URL}/${id}`, roleData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to update role' };
    }
};

export const deleteRole = async (id) => {
    try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to delete role' };
    }
};