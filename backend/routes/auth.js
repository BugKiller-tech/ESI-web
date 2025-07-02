// routes/auth.js
const express = require('express');
const { signup, signin, getUser } = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');
const adminCheckMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/get-user', authenticateJWT, getUser);

// Protected route
router.get('/protected', authenticateJWT, (req, res) => {
    res.send('This is a protected route.');
});

module.exports = router;
