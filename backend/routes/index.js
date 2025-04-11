const express = require('express')
const fs = require('fs');
const HorsesImageModel = require('../models/HorsesImageModel');


const {
    // imageProcessingJobForWeek,
    imageProcessingJobUploadedViaFtp
} = require('../lib/ImageProcessor');

const authRoutes = require('./auth');
const imageRoutes = require('./uploadImages');
const adminSettingRoutes = require('./adminSetting');
const productRoutes = require('./productsRouter');
const weekAdminRoutes = require('./weekAdminRouter');
const horsesAdminRoutes = require('./horsesAdminRouter');

const router = express.Router();

router.use('/api/backend-auth', authRoutes);

router.use('/api/products', productRoutes);

router.use('/api/admin/upload', imageRoutes);
router.use('/api/admin/setting', adminSettingRoutes);

router.use('/api/admin/weeks', weekAdminRoutes);
router.use('/api/admin/horses', horsesAdminRoutes);


router.get('/api/test', async (req, res) => {
    // imageProcessingJobUploadedViaFtp('67db965aa99bbac91e70ce25');
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;