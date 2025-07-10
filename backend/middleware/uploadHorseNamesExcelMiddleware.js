const multer = require('multer');
const path = require('path');
const {
    horseNamesExcelPath,
} = require('../constants/constants');

// Set storage engine
const storage = multer.diskStorage({
    destination: horseNamesExcelPath,
    filename: function (req, file, cb) {
        cb(null, 'horsenames_' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('horseNamesExcel');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /xlsx|xls/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // // Check mime
    // const mimetype = filetypes.test(file.mimetype);

    if (extname) {
        return cb(null, true);
    } else {
        cb('Error: Excel file only!');
    }
}

module.exports = upload;