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
        // Check if profileData contains a file
        if (profileData instanceof FormData || profileData.profile_picture) {
            // Use FormData for file uploads
            const formData = new FormData();
            
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== null && profileData[key] !== undefined) {
                    formData.append(key, profileData[key]);
                }
            });

            const { createFormDataRequest } = await import('./api.js');
            const formApi = createFormDataRequest();
            const response = await formApi.put('/api/auth/profile/', formData);
            return response.data;
        } else {
            // Regular JSON request for non-file updates
            const response = await api.put('/api/auth/profile/', profileData);
            return response.data;
        }
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