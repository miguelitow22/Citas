import React, { useState } from 'react';
import '../Register.css';

function Register() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Mantener el nombre de la variable como 'password'
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        // Cambiar el nombre de 'password' a 'contraseña' según lo esperado en la base de datos
        const userData = { nombre, email, contraseña: password, estado: 'activo' }; // Suponiendo que 'estado' se setea como 'activo'
        
        // Realizamos la solicitud al backend
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuario registrado exitosamente');
        } else {
            setErrorMessage(data.error || 'Hubo un error en el registro');
        }
    };

    return (
        <div className="form-container">
            <h2>Registro de Usuario</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
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
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}

export default Register;
