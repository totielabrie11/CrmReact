import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">CRM</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            {user && user.type === 'administrador' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/new-seller">Nuevo Vendedor</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/new-event">Nuevo Evento</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/client-manager">Gestión de Clientes</Link>
                </li>
              </>
            )}
            {user && user.type === 'vendedor' && (
              <li className="nav-item">
                <Link className="nav-link" to="/seller-display">Mi Dashboard</Link>
              </li>
            )}
          </ul>
          {user ? (
            <button className="btn btn-outline-light" onClick={logout}>Cerrar Sesión</button>
          ) : (
            <Link className="btn btn-outline-light" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

