import React from 'react';
import Modal from 'react-modal';
import './VistaCalendarDetail.css'

Modal.setAppElement('#root'); // O el elemento que englobe tu aplicación

const VistaCalendarDetail = ({ isOpen, onRequestClose, eventsOfDay }) => {
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
            <strong>Nombre:</strong> {event.name}<br />
            <strong>Vendedor:</strong> {event.sellerName}<br />
            {/* Agrega aquí más detalles como desees */}
          </li>
        ))}
      </ul>
      <button onClick={onRequestClose}>Volver al Calendario</button>
    </Modal>
  );
};

export default VistaCalendarDetail;