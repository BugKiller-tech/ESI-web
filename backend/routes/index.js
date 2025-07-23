const express = require('express')
const path = require('path');
const fs = require('fs');
const HorsesImageModel = require('../models/HorsesImageModel');
const OrderModel = require('../models/OrderModel');


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
const trackerRoutes = require('./trackerRouter');
const {
    API_VERSION,
} = require('../constants/constants');

const {
    createInvoicePDFWithPdfKit,
    createInvoicePdfWithPuppeteer
} = require('../lib/invoicePdf');
const { sendOrderInvoiceMailGun } = require('../lib/emails');

const router = express.Router();

router.use(`/api/${API_VERSION}/auth`,  authRoutes);

router.use(`/api/${API_VERSION}/products`,  productRoutes);

router.use(`/api/${API_VERSION}/admin/upload`,  imageRoutes);
router.use(`/api/${API_VERSION}/admin/setting`,  adminSettingRoutes);
router.use(`/api/${API_VERSION}/admin/weeks`,  weekAdminRoutes);
router.use(`/api/${API_VERSION}/admin/horses`,  horsesAdminRoutes);
router.use(`/api/${API_VERSION}/admin/orders`,  require('./ordersAdminRoutes'));
router.use(`/api/${API_VERSION}/tracker`, trackerRoutes)



router.use(`/api/${API_VERSION}/front/weeks`,  require('./weekUserRoutes'));
router.use(`/api/${API_VERSION}/front/horses`,  require('./horsesUserRoutes'));
router.use(`/api/${API_VERSION}/checkout/stripe`, require('./stripeCheckoutRouter'));
router.use(`/api/${API_VERSION}/support`, require('./customerSupport'));


router.get(`/api/${API_VERSION}/test`,  async (req, res) => {
    // imageProcessingJobUploadedViaFtp('67db965aa99bbac91e70ce25');

    const order = await OrderModel.findById('6876bafba7c143a2c4ff3809');
    sendOrderInvoiceMailGun(order);
    
    return res.json({
        'message': 'testing',
    })
})

module.exports = router;