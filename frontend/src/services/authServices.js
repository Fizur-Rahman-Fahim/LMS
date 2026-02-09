import api from './api';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/api/auth/register/', userData);
        const { access, refresh, user } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/api/auth/login/', credentials);
        const { access, refresh, user } = response.data;

        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        localStorage.setItem('user', JSON.stringify(user));

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    },

    getProfile: async () => {
        const response = await api.get('/api/auth/profile/');
        return response.data;
    },

    updateProfile: async (profileData) => {
        const response = await api.put('/api/auth/profile/', profileData);
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/api/auth/forgot-password/', { email });
        return response.data;
    },

    resetPassword: async (token, password) => {
        const response = await api.post('/api/auth/reset-password/', { token, password });
        return response.data;
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};