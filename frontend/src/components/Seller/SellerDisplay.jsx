import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import axios from 'axios';

const SellerDisplay = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [note, setNote] = useState("");

  // Definimos fetchTasks usando useCallback para evitar el problema de ámbito y re-creación en cada render
  const fetchTasks = useCallback(async () => {
    if (user && user.type === 'vendedor') {
      try {
        const response = await axios.get(`http://localhost:3001/tasks?sellerId=${user.id}&status=pendiente`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    }
  }, [user]);

  // Usamos useEffect para llamar a fetchTasks cuando el componente se monta o cuando el usuario cambia
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = async (taskId) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${taskId}`, { status: 'completado' });
      await fetchTasks(); // Ahora fetchTasks está definido y puede ser llamado aquí
    } catch (error) {
      console.error('Error al completar la tarea:', error);
    }
  };

  const updateNote = async (taskId) => {
    try {
      await axios.put(`http://localhost:3001/tasks/${taskId}`, { note });
      setNote("");  // Limpia el campo de nota después de enviar
      await fetchTasks();  // Ahora fetchTasks está definido y puede ser llamado aquí
    } catch (error) {
      console.error('Error al actualizar la nota de la tarea:', error);
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
              <strong>Estado:</strong> {task.status} <br />
              <strong>Nota:</strong> {task.note || "Ninguna"} <br />
              <button onClick={() => completeTask(task.id)}>Marcar como Completada</button>
              <div>
                <input
                  type="text"
                  placeholder="Añadir nota"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <button onClick={() => updateNote(task.id)}>Actualizar Nota</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerDisplay;
