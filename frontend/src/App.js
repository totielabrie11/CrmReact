import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext/AuthContext'; // Verifica que la ruta sea correcta
import LoginComponent from './components/Login/LoginComponent';
import CalendarComponent from './components/Calendar/CalendarComponent';
import SellerComponent from './components/Seller/SellerComponent';
import EventComponent from './components/Event/EventComponent';
import SellerDisplay from './components/Seller/SellerDisplay'; // Asegúrate de importar SellerDisplay correctamente
import './App.css';

function Navbar() {
  const { user, logout } = useAuth(); // Usa logout para permitir cerrar sesión

  return (
    <div className="navbar">
      <Link to="/">Inicio</Link>
      {user ? (
        <>
          <Link to="/new-seller">Nuevo Vendedor</Link>
          <Link to="/new-event">Nuevo Evento</Link>
          {/* Opcionalmente, mostrar un enlace a SellerDisplay si el usuario es un vendedor */}
          {user.type === 'vendedor' && <Link to="/seller-display">Mi Dashboard</Link>}
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="App">
          <Routes>
            <Route path="/" element={<CalendarComponent />} />
            <Route path="/login" element={<LoginComponent />} />
            <Route path="/new-seller" element={<ProtectedRoute><SellerComponent /></ProtectedRoute>} />
            <Route path="/new-event" element={<ProtectedRoute><EventComponent /></ProtectedRoute>} />
            {/* Ruta protegida para SellerDisplay */}
            <Route path="/seller-display" element={<ProtectedRoute><SellerDisplay /></ProtectedRoute>} />
            {/* Añade más rutas según sea necesario */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
