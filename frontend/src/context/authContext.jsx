import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                try {
                    // Auto-refresh profile on load to get latest roles/superuser status
                    const refreshedUser = await authService.getProfile();
                    updateUser(refreshedUser);
                } catch (err) {
                    console.error('Session expired or profile fetch failed', err);
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};