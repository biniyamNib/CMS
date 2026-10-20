import axios from 'axios';

const API_URL = 'https://cms-rpx0.onrender.com/api/designations';

export const getDesignations = async () => {
    try {
    const response = await axios.get(API_URL);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch designations' };
    }
};

export const addDesignation = async (designationData) => {
    try {
    const response = await axios.post(API_URL, designationData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to add designation' };
    }
};

export const updateDesignation = async (id, designationData) => {
    try {
    const response = await axios.put(`${API_URL}/${id}`, designationData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to update designation' };
    }
};

export const deleteDesignation = async (id) => {
    try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to delete designation' };
    }
};

export const getDesignationQualifications = async (designationId) => {
    try {
    const response = await axios.get(`${API_URL}/${designationId}/qualifications`);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch qualifications' };
    }
};

export const addDesignationQualification = async (designationId, qualificationData) => {
    try {
    const response = await axios.post(`${API_URL}/${designationId}/qualifications`, qualificationData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to add qualification' };
    }
};

export const updateDesignationQualification = async (designationId, qualificationId, qualificationData) => {
    try {
    const response = await axios.put(`${API_URL}/${designationId}/qualifications/${qualificationId}`, qualificationData);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to update qualification' };
    }
};

export const deleteDesignationQualification = async (designationId, qualificationId) => {
    try {
    const response = await axios.delete(`${API_URL}/${designationId}/qualifications/${qualificationId}`);
    return response.data;
    } catch (error) {
    throw error.response?.data || { message: 'Failed to delete qualification' };
    }
};