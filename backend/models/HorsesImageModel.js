const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    week: { // Reference to User
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weeks" 
    },
    horseNumber: {
        type: String,
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
    }
})

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('HorsesImageModel', schema);
