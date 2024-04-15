import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientManager = () => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
    });

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const result = await axios.get('http://localhost:3001/clientes');
            setClients(result.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
            // Manejar el error adecuadamente aquí
        }
    };

    const handleFormChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const submitForm = async () => {
        if (isEditing) {
            await axios.put(`http://localhost:3001/clientes/${selectedClient.id}`, formData);
        } else {
            await axios.post('http://localhost:3001/clientes', formData);
        }
        fetchClients();
        resetForm();
    };

    const resetForm = () => {
        setSelectedClient(null);
        setIsEditing(false);
        setFormData({
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
        });
    };

    const startEdit = (client) => {
        setSelectedClient(client);
        setIsEditing(true);
        setFormData(client);
    };

    const deleteClient = async (clientId) => {
        await axios.delete(`http://localhost:3001/clientes/${clientId}`);
        fetchClients();
    };

    return (
        <div>
            <h1>Gestión de Clientes</h1>
            {clients.map(client => (
                <div key={client.id}>
                    <p>{client.nombre} {client.apellido}</p>
                    <button onClick={() => startEdit(client)}>Editar</button>
                    <button onClick={() => deleteClient(client.id)}>Eliminar</button>
                </div>
            ))}
            <div>
                <input name="nombre" value={formData.nombre} onChange={handleFormChange} placeholder="Nombre" />
                <input name="apellido" value={formData.apellido} onChange={handleFormChange} placeholder="Apellido" />
                <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" />
                <input name="telefono" value={formData.telefono} onChange={handleFormChange} placeholder="Teléfono" />
                <button onClick={submitForm}>{isEditing ? "Actualizar" : "Agregar"}</button>
                <button onClick={resetForm}>Cancelar</button>
            </div>
        </div>
    );
};

export default ClientManager;