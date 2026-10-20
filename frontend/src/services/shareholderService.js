import axios from 'axios';

const API_URL = 'http://localhost:5000/api/shareholders';

export const getShareholders = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch shareholders' };
  }
};

export const addShareholder = async (shareholderData) => {
  try {
    const response = await axios.post(API_URL, shareholderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add shareholder' };
  }
};

export const updateShareholder = async (id, shareholderData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, shareholderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update shareholder' };
  }
};

export const deleteShareholder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete shareholder' };
  }
};