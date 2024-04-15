import React from 'react';
import Modal from 'react-modal';
import './VistaTareasVendedor.css';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const VistaTareasVendedor = ({ isOpen, onRequestClose, tasksOfSeller, sellerName }) => {
  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Detalles de Tareas del Vendedor"
      className="Modal"
      overlayClassName="Overlay"
    >
      <h2>Tareas de {sellerName}</h2>
      <ul>
        {tasksOfSeller && tasksOfSeller.map((task, index) => (
          <li key={index}>
            <strong>Horario:</strong> {task.time}<br />
            <strong>Tarea:</strong> {task.name}<br />
            <strong>Detalle:</strong> {task.content}<br />
            <strong>Estado:</strong> {task.status}<br />
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(`/new-event`)}>Agregar Tarea</button>
      <button onClick={onRequestClose}>Cerrar</button>
    </Modal>
  );
};

export default VistaTareasVendedor;
