const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    state: {
        type: String,
    },
    year: {
        type: Number,
    },
    weekNumber: {
        type: String,
        required: true,
    },
    ftpFolderName: {
        type: String,
    },
    jsonPath: {
        type: String,
        required: true,
    },
    imageJsonData: {
        type: String,
        required: true,
    },
    isProcessed: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('FtpImageProcessModel', schema);
