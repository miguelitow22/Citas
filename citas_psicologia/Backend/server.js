const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Importar las rutas
const userRoutes = require('./routes/userRoutes'); // Rutas de usuario (registro, login, etc.)
const citaRoutes = require('./routes/citaRoutes'); // Rutas de citas

// Inicializar express
const app = express();

// Configurar dotenv (para variables de entorno)
dotenv.config();

// Middleware
app.use(cors()); // Para permitir CORS
app.use(express.json()); // Para manejar JSON en el body de las solicitudes

// Usar las rutas
app.use('/api/auth', userRoutes); // Rutas de autenticación y usuario
app.use('/api/citas', citaRoutes); // Rutas de citas (CRUD)

// Ruta por defecto para comprobar que la API está funcionando
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Puerto de la aplicación
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
