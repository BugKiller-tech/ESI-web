// routes/auth.js
const express = require('express');
const { signup, signin } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);

// Protected route
router.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route.');
});

module.exports = router;
