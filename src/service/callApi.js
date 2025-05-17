// src/service/callApi.js
import api from './api';

const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

const userService = {
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/user?id=${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

const callApi = { authService, userService };

export default callApi;
