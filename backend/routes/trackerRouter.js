const express = require('express');
const controller = require('../controllers/trackerController');


const router = express.Router();

router.get('/ftp_image_process_status/:taskId', controller.getFtpImageProcessStatusWithTaskId);

module.exports = router;
