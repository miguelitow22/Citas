const express = require('express');
const citaController = require('../controllers/citaController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Rutas de citas
router.post('/', authenticateToken, citaController.createCita); // Crear cita
router.get('/', authenticateToken, citaController.getCitas); // Obtener citas del usuario
router.delete('/:id_cita', authenticateToken, citaController.deleteCita); // Eliminar cita
router.put('/:id_cita', authenticateToken, citaController.updateCita); // Actualizar cita

module.exports = router;
