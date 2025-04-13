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

router.use('/api/v1/backend-auth', authRoutes);

router.use('/api/v1/products', productRoutes);

router.use('/api/v1/admin/upload', imageRoutes);
router.use('/api/v1/admin/setting', adminSettingRoutes);
router.use('/api/v1/admin/weeks', weekAdminRoutes);
router.use('/api/v1/admin/horses', horsesAdminRoutes);



router.use('/api/v1/front/weeks', require('./weekUserRoutes'));
router.use('/api/v1/front/horses', require('./horsesUserRoutes'));


router.get('/api/v1/test', async (req, res) => {
    // imageProcessingJobUploadedViaFtp('67db965aa99bbac91e70ce25');
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;