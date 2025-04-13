const express = require('express');
const controller = require('../controllers/categoryController');


const router = express.Router();

router.post('/get', controller.getWeeksWithPagination);
router.post('/update-visibility', controller.updateVisibility);



module.exports = router;