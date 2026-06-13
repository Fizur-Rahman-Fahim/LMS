import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authServices';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const initAuth = async () => {
            const currentUser = authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                // Initialize theme from user data
                const userTheme = currentUser.theme || 'light';
                setTheme(userTheme);
                applyTheme(userTheme);
                
                try {
                    // Auto-refresh profile on load to get latest roles/superuser status
                    const refreshedUser = await authService.getProfile();
                    updateUser(refreshedUser);
                    // Update theme if changed
                    const newTheme = refreshedUser.theme || 'light';
                    if (newTheme !== userTheme) {
                        setTheme(newTheme);
                        applyTheme(newTheme);
                    }
                } catch (err) {
                    console.error('Session expired or profile fetch failed', err);
                    if (err.response?.status === 401) {
                        logout();
                    }
                }
            } else {
                // Check localStorage for theme preference
                const savedTheme = localStorage.getItem('theme') || 'light';
                setTheme(savedTheme);
                applyTheme(savedTheme);
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const applyTheme = (themeValue) => {
        if (themeValue === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', themeValue);
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);

        // If user is logged in, sync to backend
        if (user) {
            try {
                const updatedUser = { ...user, theme: newTheme };
                
                // Send all required fields
                await authService.updateProfile({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    bio: user.bio || '',
                    theme: newTheme
                });
                
                updateUser(updatedUser);
            } catch (error) {
                console.error('Failed to save theme preference:', error);
                // Revert theme if save fails
                const oldTheme = newTheme === 'light' ? 'dark' : 'light';
                setTheme(oldTheme);
                applyTheme(oldTheme);
            }
        }
    };

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        const userTheme = data.user.theme || 'light';
        setTheme(userTheme);
        applyTheme(userTheme);
        return data;
    };

    const register = async (userData) => {
        const data = await authService.register(userData);
        setUser(data.user);
        const userTheme = data.user.theme || 'light';
        setTheme(userTheme);
        applyTheme(userTheme);
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        // Reset to light theme on logout
        setTheme('light');
        applyTheme('light');
    };

    const updateUser = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading, theme, toggleTheme }}>
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