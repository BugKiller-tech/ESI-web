const express = require('express');
const router = express.Router();
const uploadHorseImagesMiddleware = require('../middleware/uploadHorseImagesMiddleware');
const uploadTimestampJsonMiddleware = require('../middleware/uploadHorseImagesMiddleware');

const {
    uploadImages,
} = require('../controllers/uploadImagesController');

router.post('/horses', 
    uploadHorseImagesMiddleware,
    // uploadTimestampJsonMiddleware,

    uploadImages);


module.exports = router;