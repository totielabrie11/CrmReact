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
    <div className="container mt-5">
      <h1>Gestión de Clientes</h1>
      <div className="row">
        <div className="col-md-6">
          {clients.map(client => (
            <div key={client.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{client.nombre} {client.apellido}</h5>
                <p className="card-text">Email: {client.email}</p>
                <p className="card-text">Teléfono: {client.telefono}</p>
                <button className="btn btn-primary me-2" onClick={() => startEdit(client)}>Editar</button>
                <button className="btn btn-danger" onClick={() => deleteClient(client.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditing ? "Editar Cliente" : "Agregar Cliente"}</h5>
              <form onSubmit={submitForm}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input type="text" name="apellido" className="form-control" value={formData.apellido} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={formData.email} onChange={handleFormChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input type="tel" name="telefono" className="form-control" value={formData.telefono} onChange={handleFormChange} required />
                </div>
                <button type="submit" className="btn btn-success">{isEditing ? "Actualizar" : "Agregar"}</button>
                {isEditing && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancelar</button>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientManager;
