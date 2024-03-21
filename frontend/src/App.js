import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext/AuthContext'; // Asegúrate de que la ruta sea correcta
import LoginComponent from './components/Login/LoginComponent';
import CalendarComponent from './components/Calendar/CalendarComponent';
import SellerComponent from './components/Seller/SellerComponent';
import EventComponent from './components/Event/EventComponent';
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
          <button onClick={logout}>Cerrar Sesión</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
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
            <Route path="/new-seller" element={<SellerComponent />} />
            <Route path="/new-event" element={<EventComponent />} />
            {/* Puedes agregar más rutas según sea necesario */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
