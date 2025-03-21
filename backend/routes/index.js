const express = require('express')
const fs = require('fs');
const path = require('path');

const {
    // imageProcessingJobForWeek,
    imageProcessingJobUploadedViaFtp
} = require('../lib/ImageProcessor');

const authRoutes = require('./auth');
const imageRoutes = require('./uploadImages');
const adminSettingRoutes = require('./adminSetting');
const productRoutes = require('./productsRouter');

const router = express.Router();

router.use('/api/auth', authRoutes);

router.use('/api/products', productRoutes);

router.use('/api/admin/upload', imageRoutes);
router.use('/api/admin/setting', adminSettingRoutes);


router.get('/api/test', (req, res) => {
    imageProcessingJobUploadedViaFtp('67db965aa99bbac91e70ce25');
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;