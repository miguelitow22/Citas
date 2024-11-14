const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Rutas de usuario
router.post('/register', userController.registerUser); // Ruta de registro
router.post('/login', userController.loginUser); // Ruta de login
router.put('/update', authenticateToken, userController.updateUser); // Ruta de actualización
router.delete('/delete', authenticateToken, userController.deleteUser); // Ruta de eliminación

module.exports = router;
