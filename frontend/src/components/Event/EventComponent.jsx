import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const EventComponent = () => {
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [sellers, setSellers] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { search } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const dateParam = searchParams.get('date');
    if (dateParam) {
      setEventDate(dateParam);
    }

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

    // Verifica si el horario ya está ocupado por el mismo vendedor
  try {
    const checkTimeResponse = await axios.get(`http://localhost:3001/eventos/verificar?date=${eventDate}&time=${eventTime}&sellerId=${sellerId}`);
    if (checkTimeResponse.data.exists) {
      setErrorMessage('El horario seleccionado ya fue asignado a este vendedor');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
  }
    } catch (error) {
      console.error('Error al verificar el horario del evento:', error);
      setErrorMessage('Error al verificar el horario del evento.');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const eventData = {
      date: eventDate,
      time: eventTime,
      sellerId,
      sellerName: `${sellers.find(seller => seller.id === parseInt(sellerId))?.nombre} ${sellers.find(seller => seller.id === parseInt(sellerId))?.apellido}`,
      sellerColor: sellers.find(seller => seller.id === parseInt(sellerId))?.color,
      name: eventName,
      content: eventContent,
      status: 'pendiente'
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
    setEventTime('');
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
          <label>Horario del Evento:</label>
          <input
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            required
          />
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
  
}

export default EventComponent;

