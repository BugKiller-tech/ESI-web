const express = require('express');
const router = express.Router();
const adminCheckMiddleware = require('../middleware/adminMiddleware');
const uploadHorseImagesMiddleware = require('../middleware/uploadHorseImagesMiddleware');

const {
    uploadImages,
} = require('../controllers/uploadImagesController');


// router.use(adminCheckMiddleware);

router.post('/horses', 
    uploadHorseImagesMiddleware,
    uploadImages);


module.exports = router;