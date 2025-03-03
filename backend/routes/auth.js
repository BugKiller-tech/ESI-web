// routes/auth.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/protected', authenticateJWT, (req, res) => {
  res.send('This is a protected route.');
});

module.exports = router;
