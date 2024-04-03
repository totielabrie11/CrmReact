import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  // Comprueba si hay un usuario autenticado y si el rol del usuario está en los roles permitidos
  if (!user || !allowedRoles.includes(user.type)) {
    // Redirige al usuario al login o a otra página si no cumple con los requisitos
    return <Navigate to="/login" />;
  }

  // Si el usuario cumple con los requisitos, renderiza el componente hijo
  return children;
};
