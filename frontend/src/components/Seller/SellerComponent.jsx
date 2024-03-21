import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';

const SellerComponent = () => {
  const { user } = useAuth(); // Asumimos que useAuth es tu hook personalizado para la autenticación
  const [sellerData, setSellerData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    celular: '',
    color: '',
    otrosDatos: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [colors] = useState([
    '#FFB6C1', 
    '#FA8072', 
    '#FFA07A', 
    '#FFE4B5', 
    '#FFFACD', 
    '#98FB98', 
    '#AFEEEE', 
    '#FFF71D', 
    '#F08080', 
    '#F4A460'
  ]); // Aquí pones tus colores en formato hexadecimal

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSellerData({ ...sellerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMessage('Debe estar logueado para realizar esta acción');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/vendedores', sellerData);
      if (response.status === 201) {
        setSuccessMessage('Vendedor creado exitosamente.');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
      } else {
        setErrorMessage('No se pudo crear el vendedor. Intente de nuevo.');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error al guardar el vendedor:', error);
      setErrorMessage('Error al guardar el vendedor. Intente de nuevo.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setSellerData({
      nombre: '',
      apellido: '',
      edad: '',
      celular: '',
      color: '',
      otrosDatos: ''
    });
  };

  return (
    <div>
      <h2>Crear Vendedor</h2>
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={sellerData.nombre}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="apellido"
            value={sellerData.apellido}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Edad:</label>
          <input
            type="number"
            name="edad"
            value={sellerData.edad}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Celular:</label>
          <input
            type="tel"
            name="celular"
            value={sellerData.celular}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <select
            name="color"
            value={sellerData.color}
            onChange={handleInputChange}
            style={{ backgroundColor: sellerData.color }}
            required
          >
            <option value="">Seleccione un color</option>
            {colors.map(color => (
              <option key={color} value={color} style={{ backgroundColor: color }}>
                {color}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Otros Datos:</label>
          <textarea
            name="otrosDatos"
            value={sellerData.otrosDatos}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" disabled={!user}>Crear Vendedor</button>
      </form>
    </div>
  );
};

export default SellerComponent;