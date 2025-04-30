const express = require('express');
const adminCheckMiddleware = require('../middleware/adminMiddleware');
const controller = require('../controllers/weekController');


const router = express.Router();

router.post('/get-paginated', controller.getWeeksWithPagination);
router.post('/update-visibility', adminCheckMiddleware, controller.updateVisibility);
router.post('/delete', adminCheckMiddleware, controller.deleteTheWeek);



module.exports = router;