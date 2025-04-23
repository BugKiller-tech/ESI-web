// routes/auth.js
const express = require('express');
const Joi = require('joi');

const authenticateJWT = require('../middleware/authMiddleware');
const adminCheckMiddleware = require('../middleware/adminMiddleware');
const bodyValidatorMiddleware = require('../middleware/bodyValidatorMiddleware');
const uploadWatermarkImageMiddleware = require('../middleware/uploadWatermarkImageMiddleware');

const { 
    getImageProcessSetting,
    updateImageSetting,
    getWatermarkImage,
    uploadWatermarkImage,
    getTaxAndShippingFee,
    updateTaxAndShippingFee,
} = require('../controllers/adminSettingController');


const router = express.Router();

router.get('/tax-and-shipping-fee', getTaxAndShippingFee);
router.post('/tax-and-shipping-fee', bodyValidatorMiddleware(Joi.object({
        tax: Joi.number().min(0).required(),
        flatShippingFee: Joi.number().min(0).required(),
    })),
    updateTaxAndShippingFee
);


router.use(adminCheckMiddleware);
router.get('/image-process-setting', getImageProcessSetting)
router.post('/image-process-setting', bodyValidatorMiddleware(Joi.object({
    imageSetting: {
        thumbnailPercentage: Joi.number().min(5).max(100).required(),
        thumbWebPercentage: Joi.number().min(10).max(100).required(),
    }
})), updateImageSetting)

router.get('/watermark-image', getWatermarkImage)
router.post('/upload-watermark-image',
    uploadWatermarkImageMiddleware,
    uploadWatermarkImage
);



// Protected route


module.exports = router;
