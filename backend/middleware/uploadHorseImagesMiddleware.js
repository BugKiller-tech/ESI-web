const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadFolder = 'uploads/images'

// Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// Multer configuration for multiple file uploads
const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB file size limit
}).array('horseImages', 100); // Accept up to 100 files with the 'images' field

module.exports = upload