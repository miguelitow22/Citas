import React, { useState } from 'react';
import '../Login.css';

function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validación básica del email y contraseña
        if (!email || !password) {
            setErrorMessage('Por favor, ingrese su correo y contraseña');
            return;
        }

        // Asegúrate de enviar el campo con el nombre correcto según la base de datos
        const userData = { email, contraseña: password };  // Cambié 'password' por 'contraseña'

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);  // Almacena el token al iniciar sesión
            } else {
                setErrorMessage(data.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            setErrorMessage('Hubo un problema con el servidor, intenta más tarde.');
            console.error(error);  // Para depuración
        }
    };

    return (
        <div className="form-container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Iniciar sesión</button>
            </form>
        </div>
    );
}

export default Login;
