import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      if (eventForDate) {
        // Asume que tienes clases definidas para cada color de evento en tu CSS
        return `event-${eventForDate.sellerColor}`;
      }
    }
  };

  const handleDayClick = (value) => {
    navigate(`/new-event?date=${dateToString(value)}`);
  };

  return (
    <div>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={tileClassName}
        onClickDay={handleDayClick}
      />
    </div>
  );
};

export default CalendarComponent;