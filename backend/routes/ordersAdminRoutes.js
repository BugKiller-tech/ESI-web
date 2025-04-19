const express = require('express');
const controller = require('../controllers/orderController');


const router = express.Router();


router.get('/:orderId/get', controller.getOneOrder);
router.post('/get-paginated', controller.getOrdersWithPagination);
router.post('/update-order-status', controller.updateOrderStatus);
router.get('/:orderId/download-images-zip', controller.downloadImagesZip);

module.exports = router;
