import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import { format, isValid, parseISO } from 'date-fns';
import 'bootstrap/dist/css/bootstrap.min.css';

const SellerDisplay = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newNote, setNewNote] = useState("");

  const fetchTasks = useCallback(async () => {
    if (user && user.type === 'vendedor') {
      try {
        const response = await axios.get(`http://localhost:3001/eventos?sellerId=${user.id}&status=pendiente`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const updateNote = async (taskId) => {
    if (!newNote.trim()) {
      alert("La nota no puede estar vacía.");
      return;
    }

    const noteData = {
      text: newNote,
      date: new Date().toISOString(),
    };
    try {
      await axios.put(`http://localhost:3001/eventos/${taskId}/updateNote`, noteData);
      setNewNote("");
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  };

  const markAsCompleted = async (taskId) => {
    try {
      await axios.put(`http://localhost:3001/eventos/${taskId}`, { status: 'finalizada' });
      fetchTasks();
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
    }
  };

  if (!user || user.type !== 'vendedor') {
    return <p>Acceso denegado. Solo los vendedores pueden acceder a esta página.</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Mis Tareas Pendientes</h2>
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item mb-3">
            <div>
              <h5>{task.name}</h5>
              <p><strong>Detalle:</strong> {task.content}</p>
              <p><strong>Estado:</strong> {task.status}</p>
              {task.notes?.map((note, index) => (
                <div key={index} className="alert alert-secondary">
                  <strong>Nota ({isValid(parseISO(note.date)) ? format(parseISO(note.date), 'PPpp') : 'Fecha inválida'}):</strong> {note.text}
                </div>
              ))}
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Añadir nota"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button className="btn btn-primary" onClick={() => updateNote(task.id)}>Actualizar Nota</button>
              </div>
              <button className="btn btn-success" onClick={() => markAsCompleted(task.id)}>Tarea Finalizada</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDisplay;



