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

/**
 * UC3.1:
 * call API lấy danh sách cuộc trò chuyện theo user id*/
const roomService={
    getRoomsByUserId: async (userId) => {
        try {
            const response = await api.get(`/rooms/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

const messageService={
    getMessagesByChatId: async (chatId) => {
        try {
            const response = await api.get(`/messages/history?chatId=${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const callApi = { authService, userService, roomService, messageService};

export default callApi;
