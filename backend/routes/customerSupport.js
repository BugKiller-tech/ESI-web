const express = require("express");
const controller = require('../controllers/customerSupportController');

const router = express.Router();



router.post('/contact-us', controller.sendContactUs);

module.exports = router;
