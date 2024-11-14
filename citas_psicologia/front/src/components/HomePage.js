// src/components/HomePage.js
import React, { useState } from 'react';
import '../HomePage.css'; // Importa los estilos específicos para HomePage
import Register from './Register';
import Login from './Login';
import heroImage from '../image.png';  // Ruta correcta para importar la imagen

const HomePage = ({ setToken }) => {
  const [mostrarFormulario, setMostrarFormulario] = useState('');

  return (
    <div className="home-page">
      <div className="hero-section">
        <img 
          src={heroImage}  // Usamos la variable heroImage para la imagen
          alt="Bienvenida" 
          className="hero-image" 
        />
        <h1>Bienvenido a la Plataforma de Citas Psicológicas</h1>
        <p className="slogan">Conéctate con tu bienestar emocional.</p>
      </div>
      
      <div className="buttons-container">
        <button className="btn btn-primary" onClick={() => setMostrarFormulario('login')}>
          Iniciar Sesión
        </button>
        <button className="btn btn-secondary" onClick={() => setMostrarFormulario('register')}>
          Registrarse
        </button>
      </div>

      {/* Mostrar el formulario de Login o Register */}
      {mostrarFormulario === 'login' && <Login setToken={setToken} />}
      {mostrarFormulario === 'register' && <Register />}
    </div>
  );
};

export default HomePage;
