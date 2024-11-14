const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado: no se proporcionó token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Aquí estamos almacenando el id_usuario decodificado en el req.user
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Acceso denegado: token inválido' });
    }
};

module.exports = authenticateToken;
