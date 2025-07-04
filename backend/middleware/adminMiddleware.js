const jwt = require('jsonwebtoken');
require('dotenv').config();
const adminCheckMiddleware = (req, res, next) => {
    const authHeader = req.headers && req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) return res.status(403).json({
        message: 'Access denied'
    });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({
            message: 'Invalid or expired token'
        });
        console.log('adminCheckMiddleware', user);
        if (!user.isAdmin) {
            return res.status(403).json({
                message: 'Access denied. Please check your permission',
            })
        }
        req.user = user;
        next();
    });
};

module.exports = adminCheckMiddleware;
