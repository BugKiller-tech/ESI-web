const express = require('express');
const controller = require('../controllers/orderController');
const adminCheckMiddleware = require('../middleware/adminMiddleware');


const router = express.Router();

router.use(adminCheckMiddleware);

router.get('/:orderId/get', controller.getOneOrder);
router.post('/get-paginated', controller.getOrdersWithPagination);
router.post('/update-order-status', controller.updateOrderStatus);
router.get('/:orderId/download-images-zip', controller.downloadImagesZip);
router.get('/:orderId/download-invoice', controller.downloadInvoice);
router.get('/:orderId/refund', controller.refundOrder);

module.exports = router;
