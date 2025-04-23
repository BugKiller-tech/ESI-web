const express = require('express');
const Joi = require('joi');

const router = express.Router();
const uploadHorseImagesMiddleware = require('../middleware/uploadHorseImagesMiddleware');
const uploadTimestampJsonMiddleware = require('../middleware/uploadTimestampJsonMiddleware');

const {
    uploadImages,
    uploadTimeStampJsonWithFtpFolder,
    getHorsesFtpFolders,
} = require('../controllers/uploadImagesController');
const bodyValidatorMiddleware = require('../middleware/bodyValidatorMiddleware');
const adminCheckMiddleware = require('../middleware/adminMiddleware');


router.use(adminCheckMiddleware);
router.get('/list-horses-ftp-folders', 
    // adminCheckMiddleware,
    getHorsesFtpFolders,
)

// router.post('/horses', 
//     uploadHorseImagesMiddleware,
//     uploadImages
// );

router.post('/timestamp-and-ftp-folder',
    uploadTimestampJsonMiddleware,
    bodyValidatorMiddleware(Joi.object({
        year: Joi.number().optional(),
        state: Joi.string().required('state is required'),
        weekNumber: Joi.string().optional(),
        ftpFolder: Joi.string().required('ftp folder name is required'),
        
    })),
    uploadTimeStampJsonWithFtpFolder
);


module.exports = router;
