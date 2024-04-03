import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerListStyle.css';

// Acepta updateTaskStatus como prop
const SellerList = ({ updateTaskStatus }) => {
  const [sellers, setSellers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Obtén vendedores y eventos al cargar el componente
    const fetchSellersAndEvents = async () => {
      try {
        const sellersResponse = await axios.get('http://localhost:3001/vendedores');
        const eventsResponse = await axios.get('http://localhost:3001/eventos');
        setSellers(sellersResponse.data);
        setEvents(eventsResponse.data); // Filtrar por 'pendiente' se hará en countTasksForSeller
      } catch (error) {
        console.error('Error al cargar vendedores o eventos:', error);
      }
    };

    fetchSellersAndEvents();
  }, []);

  // Función para contar las tareas pendientes de un vendedor
  const countTasksForSeller = (sellerId) => {
    // Asumiendo que sellerId es un número pero en eventos es un string.
    const pendingTasks = events.filter(event => String(event.sellerId) === String(sellerId) && event.status === 'pendiente');
    console.log(pendingTasks); // Verificar los eventos filtrados
    return pendingTasks.length;
  };
  
  

  return (
    <div className='vendedores-container'>
      <h2>Vendedores Disponibles</h2>
      <ul>
        {sellers.map(seller => (
          <li key={seller.id}>
            <span className="seller-color" style={{ backgroundColor: seller.color }}></span>
            {seller.nombre} {seller.apellido} - ({countTasksForSeller(seller.id)} tareas pendientes)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerList;




