import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';
import { format, isValid, parseISO } from 'date-fns';

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
      console.error('Error updating task status:', error);
    }
  };

  if (!user || user.type !== 'vendedor') {
    return <p>Acceso denegado. Solo los vendedores pueden acceder a esta página.</p>;
  }

  return (
    <div>
      <h2>Mis Tareas Pendientes</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>Tarea:</strong> {task.name} <br />
              <strong>Detalle:</strong> {task.content} <br />
              <strong>Estado:</strong> {task.status} <br />
              {task.notes?.map((note, index) => (
                <div key={index}>
                  <strong>Nota ({isValid(parseISO(note.date)) ? format(parseISO(note.date), 'PPpp') : 'Fecha inválida'}):</strong> {note.text}
                </div>
              ))}
              <input
                type="text"
                placeholder="Añadir nota"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button onClick={() => updateNote(task.id)}>Actualizar Nota</button>
              <button onClick={() => markAsCompleted(task.id)}>Tarea Finalizada</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDisplay;


