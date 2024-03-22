import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EventComponent = () => {
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [sellers, setSellers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { search } = useLocation();

  useEffect(() => {
    // Obtiene los parámetros de búsqueda de la URL.
    const searchParams = new URLSearchParams(search);
    const dateParam = searchParams.get('date');
    if (dateParam) {
      // Si hay una fecha en la URL, configura el estado del componente.
      setEventDate(dateParam);
    } else {
      // Si no hay fecha, muestra un error y redirige si es necesario.
      console.error('No se proporcionó fecha del evento.');
      // Redirige o maneja la falta de fecha según sea necesario.
    }

    // Función para cargar vendedores desde el backend.
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/vendedores');
        setSellers(response.data);
      } catch (error) {
        console.error('Error al cargar los vendedores:', error);
      }
    };

    fetchSellers();
  }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Debe estar logueado para realizar esta acción');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
    }

    const eventDateObj = new Date(eventDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (eventDateObj < currentDate) {
        alert('El evento no puede ser pasado.');
        return;
    }

    // Encuentra el vendedor seleccionado basado en sellerId
    const selectedSeller = sellers.find(seller => seller.id === parseInt(sellerId));

    if (!selectedSeller) {
        console.error('Vendedor no encontrado');
        setErrorMessage('Vendedor no encontrado. Por favor, seleccione un vendedor válido.');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
    }

    const eventData = {
        date: eventDate,
        sellerId, // Usando el ID del vendedor seleccionado
        sellerName: `${selectedSeller.nombre} ${selectedSeller.apellido}`, // Concatenando nombre y apellido del vendedor
        sellerColor: selectedSeller.color, // Usando el color del vendedor seleccionado
        name: eventName,
        content: eventContent,
    };

    try {
        const response = await axios.post('http://localhost:3001/eventos', eventData);
        console.log(response.data.message);
        setSuccessMessage('Evento cargado exitosamente.');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
    } catch (error) {
        console.error('Error al guardar el evento:', error);
        setErrorMessage('Error al guardar el evento.');
        setTimeout(() => setErrorMessage(''), 3000);
    }
};


  const resetForm = () => {
    setEventDate('');
    setSellerId('');
    setEventName('');
    setEventContent('');
  };

  return (
    <div>
      <h2>Crear Evento</h2>
      {successMessage && <div style={{ color: 'green', marginTop: '10px' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Fecha del Evento:</label>
          <input type="text" value={eventDate} disabled />
        </div>
        <div>
          <label>Nombre del Vendedor:</label>
          <select
            value={sellerId}
            onChange={(e) => setSellerId(e.target.value)}
            required
          >
            <option value="">Seleccione un vendedor</option>
            {sellers.map(seller => (
              <option key={seller.id} value={seller.id}>
                {seller.nombre} {seller.apellido}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Nombre del Evento:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Contenido del Evento:</label>
          <textarea
            value={eventContent}
            onChange={(e) => setEventContent(e.target.value)}
            required
          />
        </div>
        <button type="submit">Crear Evento</button>
      </form>
    </div>
  );
};

export default EventComponent;
