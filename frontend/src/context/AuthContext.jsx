import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (saved && token) setUser(JSON.parse(saved));
        setLoading(false);
    }, []);

    const login = async (creds) => {
        const res = await authService.login(creds);
        const { token, username, role, id } = res.data;
        const u = { username, role, id };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
        return u;
    };

    const register = async (data) => {
        const res = await authService.register(data);
        const { token, username, role, id } = res.data;
        const u = { username, role, id };
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
