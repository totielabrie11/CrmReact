import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext/AuthContext';

const SellerComponent = () => {
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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
    '#FFB6C1', '#FA8072', '#FFA07A', '#FFE4B5', 
    '#FFFACD', '#98FB98', '#AFEEEE', '#FFF71D', 
    '#F08080', '#F4A460'
  ]);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/vendedores');
      setSellers(response.data);
    } catch (error) {
      console.error('Error loading sellers:', error);
    }
  };

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
    const method = isEditing ? 'put' : 'post';
    const url = isEditing ? `http://localhost:3001/vendedores/${selectedSeller.id}` : 'http://localhost:3001/vendedores';
    try {
      const response = await axios[method](url, sellerData);
      if (response.status === 200 || response.status === 201) {
        setSuccessMessage(isEditing ? 'Vendedor actualizado exitosamente.' : 'Vendedor creado exitosamente.');
        setTimeout(() => setSuccessMessage(''), 3000);
        resetForm();
        fetchSellers();
      }
    } catch (error) {
      console.error('Error saving the seller:', error);
      setErrorMessage('Error al guardar el vendedor. Intente de nuevo.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const startEdit = (seller) => {
    setSelectedSeller(seller);
    setIsEditing(true);
    setSellerData(seller);
  };

  const handleDelete = async (sellerId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/vendedores/${sellerId}`);
      if (response.status === 200) {
        setSuccessMessage('Vendedor eliminado exitosamente.');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchSellers();
      }
    } catch (error) {
      console.error('Error deleting the seller:', error);
      setErrorMessage('Error al eliminar el vendedor. Intente de nuevo.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedSeller(null);
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
    <div className="container mt-5">
      <h1>Gestión de Vendedores</h1>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{isEditing ? 'Editar Vendedor' : 'Crear Vendedor'}</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" name="nombre" className="form-control" value={sellerData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido</label>
                  <input type="text" name="apellido" className="form-control" value={sellerData.apellido} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Edad</label>
                  <input type="number" name="edad" className="form-control" value={sellerData.edad} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Celular</label>
                  <input type="tel" name="celular" className="form-control" value={sellerData.celular} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Color</label>
                  <select name="color" className="form-select" value={sellerData.color} onChange={handleInputChange} style={{ backgroundColor: sellerData.color }} required>
                    <option value="">Seleccione un color</option>
                    {colors.map(color => (
                      <option key={color} value={color} style={{ backgroundColor: color }}>{color}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Otros Datos</label>
                  <textarea name="otrosDatos" className="form-control" value={sellerData.otrosDatos} onChange={handleInputChange} />
                </div>
                <button type="submit" className="btn btn-success">{isEditing ? 'Actualizar' : 'Crear'} Vendedor</button>
                {isEditing && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Cancelar Edición</button>}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          {sellers.map(seller => (
            <div key={seller.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{seller.nombre} {seller.apellido} - <span style={{ backgroundColor: seller.color, padding: '2px 5px' }}>{seller.color}</span></h5>
                <p className="card-text">Edad: {seller.edad}</p>
                <p className="card-text">Celular: {seller.celular}</p>
                <p className="card-text">Otros Datos: {seller.otrosDatos}</p>
                <button className="btn btn-primary me-2" onClick={() => startEdit(seller)}>Editar</button>
                <button className="btn btn-danger" onClick={() => handleDelete(seller.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerComponent;


