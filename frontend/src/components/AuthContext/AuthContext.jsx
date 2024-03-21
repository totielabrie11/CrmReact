import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Crear el contexto de autenticación
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
        const response = await axios.post('http://localhost:3001/login', { username, password });
        if (response.data && response.data.user) {
            setUser(response.data.user); // Establecer el usuario en el estado
            console.log('Login exitoso', response.data);
        } else {
            throw new Error('Login fallido: No se recibieron los datos del usuario');
        }
    } catch (error) {
        console.error('Error en la petición de login:', error);
        throw error; // Lanzar el error para que pueda ser capturado por el componente que llama a login
    }
};
  // Función para cerrar sesión
  const logout = () => {
    setUser(null); // Limpiar el usuario del estado
    // Aquí podrías también hacer una solicitud al backend si es necesario
  };

  // Cargar el estado del usuario al iniciar la aplicación
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const response = await axios.get('/api/current_user');
        setUser(response.data.user); // Establecer el usuario en el estado si está autenticado
      } catch (error) {
        console.log('No hay usuario actualmente autenticado');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // El valor que será pasado al contexto
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
