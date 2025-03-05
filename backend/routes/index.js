const express = require('express')
const authRoutes = require('./auth');
const imageRoutes = require('./uploadImages');
const { imageProcessingJobForWeek } = require('../lib/ImageProcessor');

const router = express.Router();

router.use('/api/auth', authRoutes);
router.use('/api/upload', imageRoutes);

router.get('/api/test', (req, res) => {
    imageProcessingJobForWeek('W_292');
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;