import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
    const { search } = useLocation();

    useEffect(() => {
        const fetchResources = async () => {
            const sellersData = await axios.get('http://localhost:3001/vendedores');
            const clientsData = await axios.get('http://localhost:3001/clientes');
            setSellers(sellersData.data);
            setClients(clientsData.data);
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
            status: 'pending'
        };

        try {
            const response = await axios.post('http://localhost:3001/eventos', eventData);
            setSuccessMessage(`Evento cargado exitosamente. ID: ${response.data.id}`);
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
        setClientId('');
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
                    <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
                </div>
                <div>
                    <label>Horario del Evento:</label>
                    <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
                </div>
                <div>
                    <label>Nombre del Vendedor:</label>
                    <select value={sellerId} onChange={(e) => setSellerId(e.target.value)} required>
                        <option value="">Seleccione un vendedor</option>
                        {sellers.map(seller => <option key={seller.id} value={seller.id}>{seller.nombre} {seller.apellido}</option>)}
                    </select>
                </div>
                <div>
                    <label>Nombre del Cliente:</label>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                        <option value="">Seleccione un cliente</option>
                        {clients.map(client => <option key={client.id} value={client.id}>{client.nombre} {client.apellido}</option>)}
                    </select>
                </div>
                <div>
                    <label>Nombre del Evento:</label>
                    <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
                </div>
                <div>
                    <label>Contenido del Evento:</label>
                    <textarea value={eventContent} onChange={(e) => setEventContent(e.target.value)} required />
                </div>
                <button type="submit">Crear Evento</button>
            </form>
        </div>
    );
};

export default EventComponent;
