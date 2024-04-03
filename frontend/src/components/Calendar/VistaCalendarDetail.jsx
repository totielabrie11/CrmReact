import React from 'react';
import Modal from 'react-modal';
import './VistaCalendarDetail.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const VistaCalendarDetail = ({ isOpen, onRequestClose, eventsOfDay, selectedDate, updateTaskStatus }) => {
  const navigate = useNavigate();

  const sortedEventsOfDay = [...eventsOfDay].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  const handleAddTaskClick = () => {
    onRequestClose(); // Cierra el modal
    navigate(`/new-event?date=${encodeURIComponent(selectedDate)}`); // Navega a la página de nuevo evento con la fecha seleccionada
  };

  // Función para manejar la actualización del estado de una tarea
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    updateTaskStatus(taskId, newStatus).then(() => {
      onRequestClose(); // Opcional: Cierra el modal después de actualizar
      // Considera refrescar los eventos o realizar alguna otra acción después de la actualización
    });
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
        {sortedEventsOfDay.map((event, index) => (
          <li key={index}>
            <strong>Horario:</strong> {event.time}<br />
            <strong>Vendedor:</strong> {event.sellerName}<br />
            <strong>Tarea:</strong> {event.name}<br />
            <strong>Detalle:</strong> {event.content}<br />
            <strong>Estado:</strong> {event.status}<br />
            {/* Añadir botón para actualizar el estado de la tarea */}
            <button onClick={() => handleUpdateTaskStatus(event.id, 'completado')}>Marcar como completado</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddTaskClick}>Agregar Tarea</button>
      <button onClick={onRequestClose}>Volver al Calendario</button>
    </Modal>
  );
};

export default VistaCalendarDetail;
