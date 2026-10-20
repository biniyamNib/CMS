import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api/organization';

export const getOrgStructure = async (companyId) => {
  try {
    const response = await axios.get(`${API_URL}/${companyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch organizational structure' };
  }
};