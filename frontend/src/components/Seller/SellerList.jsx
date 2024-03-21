import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerListStyle.css'; // Asegúrate de que este importe esté correcto

const SellerList = () => {
  const [vendedores, setVendedores] = useState([]);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const response = await axios.get('http://localhost:3001/vendedores');
        setVendedores(response.data);
      } catch (error) {
        console.error('Error al cargar la lista de vendedores:', error);
        // Aquí puedes manejar el error, como mostrar un mensaje al usuario
      }
    };

    fetchVendedores();
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar el componente

  return (
    <div className='vendedores-container'>
      <h2>Vendedores Disponibles</h2>
      <ul>
        {vendedores.map(vendedor => (
          <li key={vendedor.id} style={{ color: vendedor.color }}>
            {vendedor.nombre} {vendedor.apellido}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerList;
