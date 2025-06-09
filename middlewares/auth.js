const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Accesso negato' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch {
        res.status(400).json({ error: 'Token non valido' });
    }
}

module.exports = authenticate;
