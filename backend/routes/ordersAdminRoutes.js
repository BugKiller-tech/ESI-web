const express = require('express');
const controller = require('../controllers/orderController');


const router = express.Router();


router.get('/get/:orderId', controller.getOneOrder);
router.post('/get-paginated', controller.getOrdersWithPagination);
router.post('/update-order-status', controller.updateOrderStatus);

module.exports = router;
