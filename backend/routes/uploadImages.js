const express = require('express');
const Joi = require('joi');

const router = express.Router();
const uploadHorseImagesMiddleware = require('../middleware/uploadHorseImagesMiddleware');
const uploadTimestampJsonMiddleware = require('../middleware/uploadTimestampJsonMiddleware');
const uploadHorseNamesExcelMiddleware = require('../middleware/uploadHorseNamesExcelMiddleware');

const {
    uploadImages,
    uploadTimeStampJsonWithFtpFolder,
    getHorsesFtpFolders,
    uploadHorseNamesExcelAction,
    uploadHorseNamesExcelForUpcomingWeekAction,
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


router.post('/upload-horse-names',
    uploadHorseNamesExcelMiddleware,
    bodyValidatorMiddleware(Joi.object({
        weekId: Joi.string().required('Please provide the week id'),
    })),
    uploadHorseNamesExcelAction
)

router.post('/upload-horse-names-for-upcoming-week',
    uploadHorseNamesExcelMiddleware,
    bodyValidatorMiddleware(Joi.object({
        year: Joi.number().required('year is required'),
        state: Joi.string().required('state is required'),
        weekNumber: Joi.string().required('week number is required'),
    })),
    uploadHorseNamesExcelForUpcomingWeekAction
)


module.exports = router;
