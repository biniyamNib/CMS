import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api/licenses';

export const getLicenseRecords = async () => {
    try {
    const response = await axios.get(API_URL);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch license records' };
    }
};

export const addLicenseRecord = async (licenseData) => {
    try {
    const formData = new FormData();
    Object.keys(licenseData).forEach((key) => {
        if (key === 'document' && licenseData[key]) {
        formData.append('document', licenseData[key]);
        } else {
        formData.append(key, licenseData[key]);
        }
    });
    const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to add license record' };
    }
};

export const updateLicenseRecord = async (id, licenseData) => {
    try {
    const formData = new FormData();
    Object.keys(licenseData).forEach((key) => {
        if (key === 'document' && licenseData[key]) {
        formData.append('document', licenseData[key]);
        } else {
        formData.append(key, licenseData[key]);
        }
    });
    const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to update license record' };
    }
};

export const deleteLicenseRecord = async (id) => {
    try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to delete license record' };
    }
};