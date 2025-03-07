const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    imageSetting: {
        thumbnailPercentage: {
            type: Number,
            default: 5,
        },
        thumbWebPercentage: {
            type: Number,
            default: 25,
        },
    },
    watermarkImage: {
        type: String,
        default: '',
    },
    tax: {

    }
})

module.exports = mongoose.model('ProjectSettingModel', schema);