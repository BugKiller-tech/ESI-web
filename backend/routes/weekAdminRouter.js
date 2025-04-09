const express = require('express');
const controller = require('../controllers/categoryController');


const router = express.Router();

router.post('/get', controller.getCategories);
router.post('/update-visibility', controller.updateVisibility);



module.exports = router;