import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SellerList from '../Seller/SellerList';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css'; // Asegúrate de que este importe esté correcto

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/eventos');
        setEvents(response.data); // Asume que la respuesta es un array de eventos
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  const dateToString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = dateToString(date);
      const eventForDate = events.find(event => dateToString(new Date(event.date)) === dateString);
      if (eventForDate && eventForDate.sellerColor) {
        // Convertir el color a un formato válido para la clase CSS (sin '#')
        const colorClassSuffix = eventForDate.sellerColor.replace('#', '');
        return `react-calendar__tile--event-color-${colorClassSuffix}`;
      }
    }
  };
  
  const handleDayClick = (value) => {
    navigate(`/new-event?date=${dateToString(value)}`);
  };

  return (
    <div className='main-content'>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
        onClickDay={handleDayClick}
      />
      <SellerList />
    </div>
  );
};

export default CalendarComponent;