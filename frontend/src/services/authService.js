import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api/users';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const signup = async (username, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      email,
      password,
      role,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Signup failed' };
  }
};