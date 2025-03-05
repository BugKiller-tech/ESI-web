const mongoose = require('mongoose');


const schema = new mongoose.Schema({
    weekNumber: {
        type: String,
        required: true,
    },
    jsonPath: {
        type: String,
        required: true,
    },
    imagePath: {
        type: String,
        required: true,
    },
    imageFileName: {
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

module.exports = mongoose.model('ImageProcessModel', schema);
