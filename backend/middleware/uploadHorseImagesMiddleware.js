const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Constants = require('../constants/constants');

const imageUploadFolder = Constants.originImagePath;
const timeStampJsonUploadFolder = Constants.timestampJsonPath

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'horseImages') {
            cb(null, imageUploadFolder);
        } else if (file.fieldname === 'timestampJson') {
            cb(null, timeStampJsonUploadFolder);
        } else { // just in case any other fields are selected
            cb(null, imageUploadFolder)
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Multer configuration for multiple file uploads
const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB file size limit
}).fields([
    { name: 'horseImages', maxCount: 200 },
    { name: 'timestampJson', maxCount: 1 },
])
// .array('horseImages', 100); // Accept up to 100 files with the 'images' field

module.exports = upload