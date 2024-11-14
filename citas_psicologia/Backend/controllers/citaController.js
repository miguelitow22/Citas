const db = require('../config/db');

// Crear una nueva cita
const createCita = async (req, res) => {
    const { fecha_cita, notas } = req.body;
    const userId = req.user.id_usuario; // Usando el id del usuario que está autenticado

    if (!fecha_cita) {
        return res.status(400).json({ error: 'La fecha de la cita es obligatoria' });
    }

    try {
        // Realizamos la consulta usando db.query directamente (sin .promise())
        const [result] = await db.query(
            'INSERT INTO citas (id_usuario, fecha_cita, estado, notas) VALUES (?, ?, ?, ?)',
            [userId, fecha_cita, 'pendiente', notas]
        );

        res.status(201).json({ message: 'Cita creada exitosamente', citaId: result.insertId });
    } catch (error) {
        console.error('Error al crear la cita:', error);
        res.status(500).json({ error: 'Error al crear la cita' });
    }
};

// Obtener todas las citas de un usuario
const getCitas = async (req, res) => {
    const userId = req.user.id_usuario;

    try {
        const [citas] = await db.query('SELECT * FROM citas WHERE id_usuario = ?', [userId]);
        res.status(200).json(citas);
    } catch (error) {
        console.error('Error al obtener las citas:', error);
        res.status(500).json({ error: 'Error al obtener las citas' });
    }
};

// Eliminar una cita
const deleteCita = async (req, res) => {
    const { id_cita } = req.params;
    const userId = req.user.id_usuario;

    try {
        const [cita] = await db.query('SELECT * FROM citas WHERE id_cita = ? AND id_usuario = ?', [id_cita, userId]);
        if (cita.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        await db.query('DELETE FROM citas WHERE id_cita = ?', [id_cita]);

        res.status(200).json({ message: 'Cita eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la cita:', error);
        res.status(500).json({ error: 'Error al eliminar la cita' });
    }
};

// Actualizar una cita
const updateCita = async (req, res) => {
    const { id_cita } = req.params;
    const { fecha_cita, estado, notas } = req.body;
    const userId = req.user.id_usuario;

    try {
        const [cita] = await db.query('SELECT * FROM citas WHERE id_cita = ? AND id_usuario = ?', [id_cita, userId]);
        if (cita.length === 0) {
            return res.status(404).json({ error: 'Cita no encontrada' });
        }

        const updatedFields = [];
        if (fecha_cita) updatedFields.push(`fecha_cita = ?`);
        if (estado) updatedFields.push(`estado = ?`);
        if (notas) updatedFields.push(`notas = ?`);

        if (updatedFields.length > 0) {
            const query = `UPDATE citas SET ${updatedFields.join(', ')} WHERE id_cita = ?`;
            const values = [fecha_cita, estado, notas, id_cita].filter(val => val !== undefined);

            await db.query(query, values);
            res.status(200).json({ message: 'Cita actualizada exitosamente' });
        } else {
            res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

    } catch (error) {
        console.error('Error al actualizar la cita:', error);
        res.status(500).json({ error: 'Error al actualizar la cita' });
    }
};

module.exports = {
    createCita,
    getCitas,
    deleteCita,
    updateCita
};
