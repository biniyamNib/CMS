import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api/companies';

export const registerCompany = async (companyData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, companyData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Company registration failed' };
  }
};