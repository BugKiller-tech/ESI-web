const express = require('express');
const router = express.Router();
const adminCheckMiddleware = require('../middleware/adminMiddleware');
const uploadHorseImagesMiddleware = require('../middleware/uploadHorseImagesMiddleware');

const {
    uploadImages,
} = require('../controllers/uploadImagesController');

router.post('/horses', 
    adminCheckMiddleware,
    uploadHorseImagesMiddleware,
    uploadImages);


module.exports = router;