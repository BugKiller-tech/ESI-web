const express = require('express');
const controller = require('../controllers/weekController');


const router = express.Router();

router.post('/get-paginated', controller.getWeeksWithPagination);
router.post('/update-visibility', controller.updateVisibility);



module.exports = router;