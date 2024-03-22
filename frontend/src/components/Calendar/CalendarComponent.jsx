import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SellerList from '../Seller/SellerList';
import VistaCalendarDetail from './VistaCalendarDetail';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css';

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); // Agregado para manejar la fecha seleccionada
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3001/eventos');
        setEvents(response.data);
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
        const colorClassSuffix = eventForDate.sellerColor.replace('#', '');
        return `react-calendar__tile--event-color-${colorClassSuffix}`;
      }
    }
  };

  const handleDayClick = (value) => {
    const dateString = dateToString(value);
    const eventsForDay = events.filter(event => dateToString(new Date(event.date)) === dateString);

    setSelectedDate(dateString); // Establece la fecha seleccionada cuando se hace clic en un día

    if (eventsForDay.length > 0) {
      setSelectedDayEvents(eventsForDay);
      setModalIsOpen(true);
    } else {
      navigate(`/new-event?date=${dateString}`);
    }
  };
  
  const closeModal = () => {
    setModalIsOpen(false);
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
      <VistaCalendarDetail 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        eventsOfDay={selectedDayEvents}
        selectedDate={selectedDate} // Pasa la fecha seleccionada a VistaCalendarDetail
      />
    </div>
  );
};

export default CalendarComponent;