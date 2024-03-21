// En src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/">Inicio</Link>
      {user ? (
        <>
          <Link to="/new-event">Nuevo Evento</Link>
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Iniciar Sesión</Link>
      )}
    </nav>
  );
};

export default Navbar;
