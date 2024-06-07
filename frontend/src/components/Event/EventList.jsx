import React, { useState } from 'react';

const EventList = ({ events }) => {
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterSeller, setFilterSeller] = useState('todos');

  const handleStatusFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleSellerFilterChange = (event) => {
    setFilterSeller(event.target.value);
  };

  const sellers = [...new Set(events.map(event => event.sellerName))];

  const filteredEvents = events.filter(event => {
    return (filterStatus === 'todos' || event.status === filterStatus) &&
           (filterSeller === 'todos' || event.sellerName === filterSeller);
  });

  return (
    <div>
      <h2>Próximos Eventos</h2>
      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">Filtrar por estado:</label>
        <select 
          id="statusFilter" 
          className="form-select" 
          value={filterStatus} 
          onChange={handleStatusFilterChange}
        >
          <option value="todos">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>
      <div className="mb-3">
        <label htmlFor="sellerFilter" className="form-label">Filtrar por vendedor:</label>
        <select 
          id="sellerFilter" 
          className="form-select" 
          value={filterSeller} 
          onChange={handleSellerFilterChange}
        >
          <option value="todos">Todos</option>
          {sellers.map(seller => (
            <option key={seller} value={seller}>{seller}</option>
          ))}
        </select>
      </div>
      <ul className="list-group">
        {filteredEvents.map(event => (
          <li key={event.id} className="list-group-item">
            <h5>{event.name}</h5>
            <p><strong>Fecha:</strong> {event.date}</p>
            <p><strong>Hora:</strong> {event.time}</p>
            <p><strong>Cliente:</strong> {event.clientName}</p>
            <p><strong>Vendedor:</strong> {event.sellerName}</p>
            <p><strong>Status:</strong> {event.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;

