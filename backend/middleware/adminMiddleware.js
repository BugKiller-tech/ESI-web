// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const adminCheckMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    if (!user.isAdmin){
      return res.status(400).json({
        message: 'No permision to access',
      })
    }
    req.user = user;
    next();
  });
};

module.exports = adminCheckMiddleware;
