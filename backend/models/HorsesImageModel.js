const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    week: { // Reference to Week
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weeks"
    },
    horseNumber: {
        type: String,
    },
    horseInfo: { // reference the normalized name
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeekHorseInfo'
    },
    originImageName: {
        type: String,
    },
    originImageS3Link: {
        type: String,
    },
    thumbWebS3Link: {
        type: String,
    },
    thumbnailS3Link: {
        type: String,
    },
    aspectRatio: {
        type: Number,
        default: 1,
    },
    photoTakenTime: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Number,
        default: 0,
    },

    isCheckedForCandidAwardShot: {
        type: Number,
        default: 0,
    }
})

schema.index({ week: 1, horseNumber: 1 })


schema.plugin(mongoosePaginate);

module.exports = mongoose.model('HorsesImageModel', schema);
