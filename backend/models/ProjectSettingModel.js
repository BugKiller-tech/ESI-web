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
    tax: { // this is percentage
        type: Number,
        default: 0,
    },
    flatShippingFee: {
        type: Number,
        default: 0,
    }
})

module.exports = mongoose.model('ProjectSettingModel', schema);