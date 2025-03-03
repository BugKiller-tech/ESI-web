const express = require('express')
const authRoutes = require('./auth');
const imageRoutes = require('./uploadImages');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/upload', imageRoutes);

module.exports = router;