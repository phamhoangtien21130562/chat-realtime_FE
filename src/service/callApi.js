// src/service/callApi.js
import api from './api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

const userService = {
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/api/user?id=${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

const callApi = { authService, userService };

export default callApi;
