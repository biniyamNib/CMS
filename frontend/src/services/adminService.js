import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

export const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}/companies`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch companies' };
  }
};

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};