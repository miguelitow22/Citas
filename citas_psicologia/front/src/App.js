// src/App.js
import React, { useState } from 'react';
import './App.css';  // Correcto si el archivo está en src
import './Register.css';  // Correcto si el archivo está en src
import './Login.css';     // Correcto si el archivo está en src
import './Citas.css';     // Correcto si el archivo está en src
import HomePage from './components/HomePage';  // Página de inicio
import Register from './components/Register';  // Componente de registro
import Login from './components/Login';  // Componente de login
import Citas from './components/Citas';  // Componente de citas

function App() {
  const [token, setToken] = useState('');  // Almacenar token
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Verificación de autenticación

  return (
    <div className="App">
      {!token && !isAuthenticated ? (
        <HomePage setToken={setToken} />
      ) : token ? (
        <Citas token={token} />
      ) : (
        <div>
          <Register />
          <Login setToken={setToken} />
        </div>
      )}
    </div>
  );
}

export default App;
