import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext'; // Asegúrate de que la ruta de importación sea correcta

const LoginComponent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Utilizamos useAuth para acceder a la función login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            console.log("Usuario logueado exitosamente");
        } catch (error) {
            console.error("Error en el login:", error);
            // Actualizar el estado aquí para mostrar un mensaje de error en la UI
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginComponent;
