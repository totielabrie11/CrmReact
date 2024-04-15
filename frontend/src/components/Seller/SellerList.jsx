import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import VistaTareasVendedor from './VistaTareasVendedor'; // Asegúrate de que la ruta de importación sea correcta
import './SellerListStyle.css';

Modal.setAppElement('#root'); // Asegúrate de que esta llamada esté en un lugar adecuado si causa problemas

const SellerList = ({ updateTaskStatus }) => {
  const [sellers, setSellers] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [pendingTasks, setPendingTasks] = useState([]);

  useEffect(() => {
    const fetchSellersAndEvents = async () => {
      try {
        const sellersResponse = await axios.get('http://localhost:3001/vendedores');
        const eventsResponse = await axios.get('http://localhost:3001/eventos?status=pendiente');
        setSellers(sellersResponse.data);
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error al cargar vendedores o eventos:', error);
      }
    };

    fetchSellersAndEvents();
  }, []);

  const countTasksForSeller = (sellerId) => {
    const pendingTasks = events.filter(event => String(event.sellerId) === String(sellerId));
    return pendingTasks.length;
  };

  // Función para manejar el clic en un vendedor
  const handleSellerClick = (seller) => {
    const sellerTasks = events.filter(event => String(event.sellerId) === String(seller.id));
    setPendingTasks(sellerTasks);
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  return (
    <div className='vendedores-container'>
      <h2>Vendedores Disponibles</h2>
      <ul>
        {sellers.map(seller => (
          <li key={seller.id} onClick={() => handleSellerClick(seller)} style={{cursor: 'pointer'}}>
            <span className="seller-color" style={{ backgroundColor: seller.color }}></span>
            {seller.nombre} {seller.apellido} - ({countTasksForSeller(seller.id)} tareas pendientes)
          </li>
        ))}
      </ul>
      {selectedSeller && (
        <VistaTareasVendedor
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          tasksOfSeller={pendingTasks}
          sellerName={`${selectedSeller.nombre} ${selectedSeller.apellido}`}
          updateTaskStatus={updateTaskStatus}
        />
      )}
    </div>
  );
};

export default SellerList;





