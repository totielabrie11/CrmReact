import React from 'react';

const EventList = ({ events }) => {
  return (
    <div>
      <h2>Próximos Eventos</h2>
      <ul className="list-group">
        {events.map(event => (
          <li key={event.id} className="list-group-item">
            <h5>{event.name}</h5>
            <p><strong>Fecha:</strong> {event.date}</p>
            <p><strong>Hora:</strong> {event.time}</p>
            <p><strong>Cliente:</strong> {event.clientName}</p>
            <p><strong>Vendedor:</strong> {event.sellerName}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
