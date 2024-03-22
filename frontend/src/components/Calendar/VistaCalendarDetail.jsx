import React from 'react';
import Modal from 'react-modal';
import './VistaCalendarDetail.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const VistaCalendarDetail = ({ isOpen, onRequestClose, eventsOfDay, selectedDate }) => {
  const navigate = useNavigate();

  const handleAddTaskClick = () => {
    onRequestClose(); // Cierra el modal
    navigate(`/new-event?date=${encodeURIComponent(selectedDate)}`); // Navega a la página de nuevo evento con la fecha seleccionada
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles del Evento"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Detalles del Evento</h2>
      <ul>
        {eventsOfDay.map((event, index) => (
          <li key={index}>
            <strong>Vendedor:</strong> {event.sellerName}<br />
            <strong>Tarea:</strong> {event.name}<br />
            <strong>Detalle:</strong> {event.content}<br />
          </li>
        ))}
      </ul>
      <button onClick={handleAddTaskClick}>Agregar Tarea</button>
      <button onClick={onRequestClose}>Volver al Calendario</button>
    </Modal>
  );
};

export default VistaCalendarDetail;
