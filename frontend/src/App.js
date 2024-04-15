import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext/AuthContext';
import LoginComponent from './components/Login/LoginComponent';
import CalendarComponent from './components/Calendar/CalendarComponent';
import SellerComponent from './components/Seller/SellerComponent';
import EventComponent from './components/Event/EventComponent';
import SellerDisplay from './components/Seller/SellerDisplay';
import ClientManager from './components/Cliente/ClientManager'; // Importa el componente de gestión de clientes

import './App.css';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <Link to="/">Inicio</Link>
      {user && (
        <>
          {user.type === 'administrador' && (
            <>
              <Link to="/new-seller">Nuevo Vendedor</Link>
              <Link to="/new-event">Nuevo Evento</Link>
              <Link to="/client-manager">Gestión de Clientes</Link>  {/* Nuevo enlace para administradores */}
            </>
          )}
          {user.type === 'vendedor' && (
            <>
              <Link to="/seller-display">Mi Dashboard</Link>
            </>
          )}
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      )}
      {!user && <Link to="/login">Login</Link>}
    </div>
  );
}

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user || (allowedRoles && !allowedRoles.includes(user.type))) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<CalendarComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/new-seller" element={<ProtectedRoute allowedRoles={['administrador']}><SellerComponent /></ProtectedRoute>} />
            <Route path="/new-event" element={<ProtectedRoute allowedRoles={['administrador']}><EventComponent /></ProtectedRoute>} />
            <Route path="/seller-display" element={<ProtectedRoute allowedRoles={['vendedor']}><SellerDisplay /></ProtectedRoute>} />
            <Route path="/client-manager" element={<ProtectedRoute allowedRoles={['administrador']}><ClientManager /></ProtectedRoute>} /> {/* Ruta protegida para la gestión de clientes */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
