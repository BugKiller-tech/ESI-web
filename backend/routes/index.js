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
const {
    API_VERSION,
} = require('../constants/constants');

const router = express.Router();

router.use(`/api/${API_VERSION}/backend-auth`,  authRoutes);

router.use(`/api/${API_VERSION}/products`,  productRoutes);

router.use(`/api/${API_VERSION}/admin/upload`,  imageRoutes);
router.use(`/api/${API_VERSION}/admin/setting`,  adminSettingRoutes);
router.use(`/api/${API_VERSION}/admin/weeks`,  weekAdminRoutes);
router.use(`/api/${API_VERSION}/admin/horses`,  horsesAdminRoutes);
router.use(`/api/${API_VERSION}/admin/orders`,  require('./ordersAdminRoutes'));



router.use(`/api/${API_VERSION}/front/weeks`,  require('./weekUserRoutes'));
router.use(`/api/${API_VERSION}/front/horses`,  require('./horsesUserRoutes'));
router.use(`/api/${API_VERSION}/checkout/stripe`, require('./stripeCheckoutRouter'));


router.get(`/api/${API_VERSION}/test`,  async (req, res) => {
    // imageProcessingJobUploadedViaFtp('67db965aa99bbac91e70ce25');
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;