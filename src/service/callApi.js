// src/service/callApi.js
import api from './api';

const searchService = {
    searchByKeyword: async (keyword) => {
        try {
            const response = await api.post('/api/search', { keyword });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
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

/**
 * UC3.1:
 * call API lấy danh sách cuộc trò chuyện theo user id*/
const roomService={
    getRoomsByUserId: async (userId) => {
        try {
            const response = await api.get(`/api/rooms/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createRoom: async (senderId, recipientId) => {
        try {
            const response = await api.post('/api/rooms/getOrCreate', { senderId, recipientId });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
}

const messageService={
    getMessagesByChatId: async (chatId) => {
        try {
            const response = await api.get(`/api/message/history?chatId=${chatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}
const callApi = { authService, userService, roomService, messageService,searchService,};

export default callApi;
