const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Usamos el pool de conexiones

// Registrar un usuario
const registerUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos requeridos (nombre, email o contraseña)' });
    }

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (user.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(contraseña, 10);

        await db.query('INSERT INTO usuarios (nombre, email, contraseña, estado) VALUES (?, ?, ?, ?)', 
                                  [nombre, email, hashedPassword, 1]);

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Iniciar sesión de usuario
const loginUser = async (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Faltan datos requeridos (email o contraseña)' });
    }

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(contraseña, user[0].contraseña);
        if (!isMatch) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id_usuario: user[0].id_usuario, nombre: user[0].nombre, email: user[0].email },
            process.env.JWT_SECRET, // Usando la clave secreta desde el archivo .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

// Actualizar perfil de usuario
const updateUser = async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    const userId = req.user.id_usuario; // Obtener el ID del usuario desde el token

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const updatedFields = [];
        if (nombre) updatedFields.push(`nombre = '${nombre}'`);
        if (email) updatedFields.push(`email = '${email}'`);
        if (contraseña) {
            const hashedPassword = await bcrypt.hash(contraseña, 10);
            updatedFields.push(`contraseña = '${hashedPassword}'`);
        }

        if (updatedFields.length > 0) {
            const query = `UPDATE usuarios SET ${updatedFields.join(', ')} WHERE id_usuario = ?`;
            await db.query(query, [userId]);
            res.status(200).json({ message: 'Perfil actualizado exitosamente' });
        } else {
            res.status(400).json({ error: 'No se proporcionaron datos para actualizar' });
        }

    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ error: 'Error al actualizar el perfil' });
    }
};

// Eliminar (desactivar) usuario
const deleteUser = async (req, res) => {
    const userId = req.user.id_usuario; // Obtener el ID del usuario desde el token

    try {
        const [user] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        await db.query('UPDATE usuarios SET estado = ? WHERE id_usuario = ?', ['inactivo', userId]);

        res.status(200).json({ message: 'Usuario desactivado exitosamente' });
    } catch (error) {
        console.error('Error al desactivar el usuario:', error);
        res.status(500).json({ error: 'Error al desactivar el usuario' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};
