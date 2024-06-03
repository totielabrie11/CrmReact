import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import EventList from './EventList';

const EventComponent = () => {
  const { user } = useAuth();
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [clientId, setClientId] = useState('');
  const [sellers, setSellers] = useState([]);
  const [clients, setClients] = useState([]);
  const [eventName, setEventName] = useState('');
  const [eventContent, setEventContent] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [events, setEvents] = useState([]);
  const { search } = useLocation();

  useEffect(() => {
    const fetchResources = async () => {
      const sellersData = await axios.get('http://localhost:3001/vendedores');
      const clientsData = await axios.get('http://localhost:3001/clientes');
      setSellers(sellersData.data);
      setClients(clientsData.data);
      const eventsData = await axios.get('http://localhost:3001/eventos');
      setEvents(eventsData.data);
    };
    fetchResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Debe estar logueado para realizar esta acción');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    const seller = sellers.find(s => s.id === parseInt(sellerId));
    const eventData = {
      date: eventDate,
      time: eventTime,
      sellerId: sellerId,
      clientId: clientId,
      sellerName: `${seller?.nombre} ${seller?.apellido}`,
      sellerColor: seller?.color,
      clientName: `${clients.find(c => c.id === parseInt(clientId))?.nombre} ${clients.find(c => c.id === parseInt(clientId))?.apellido}`,
      name: eventName,
      content: eventContent,
      status: 'pendiente'
    };

    try {
      const response = await axios.post('http://localhost:3001/eventos', eventData);
      setSuccessMessage(`Evento cargado exitosamente. ID: ${response.data.id}`);
      setTimeout(() => setSuccessMessage(''), 3000);
      resetForm();
      setEvents([...events, response.data]);
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
    setClientId('');
    setEventName('');
    setEventContent('');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-7">
          <h2>Crear Evento</h2>
          {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Fecha del Evento:</label>
              <input type="date" className="form-control" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Horario del Evento:</label>
              <input type="time" className="form-control" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del Vendedor:</label>
              <select className="form-select" value={sellerId} onChange={(e) => setSellerId(e.target.value)} required>
                <option value="">Seleccione un vendedor</option>
                {sellers.map(seller => <option key={seller.id} value={seller.id}>{seller.nombre} {seller.apellido}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del Cliente:</label>
              <select className="form-select" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                <option value="">Seleccione un cliente</option>
                {clients.map(client => <option key={client.id} value={client.id}>{client.nombre} {client.apellido}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nombre del Evento:</label>
              <input type="text" className="form-control" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Contenido del Evento:</label>
              <textarea className="form-control" value={eventContent} onChange={(e) => setEventContent(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-success">Crear Evento</button>
          </form>
        </div>
        <div className="col-md-5">
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
};

export default EventComponent;



