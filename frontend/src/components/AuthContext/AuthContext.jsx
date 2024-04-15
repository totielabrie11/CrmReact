import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/login', { username, password });
            if (response.data && response.data.user) {
                setUser(response.data.user);
            } else {
                throw new Error('Login fallido: No se recibieron los datos del usuario');
            }
        } catch (error) {
            console.error('Error en la petición de login:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
    };

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            try {
                const response = await axios.get('/api/current_user');
                setUser(response.data.user);
            } catch (error) {
                console.log('No hay usuario actualmente autenticado');
            } finally {
                setLoading(false);
            }
        };

        checkUserLoggedIn();
    }, []);

    const value = {
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
