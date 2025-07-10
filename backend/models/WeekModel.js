const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const schema = new mongoose.Schema({
    state: { // FL or NY
        type: String,
        default: '',
    },
    year: {
        type: Number,
        default: '',
    },
    weekNumber: {
        type: String,
        default: '',
    },
    isHided: { // hide in user's side
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Number,
        default: 0,
    },
    horseNamesData: {
        type: String,
        default: '',
    }
})

// schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);


// Virtual for full name
schema.virtual('displayName').get(function () {
    return `${this.year} - ${this.weekNumber}`;
});

schema.set('toJSON', { virtuals: true });
// schema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Weeks', schema);
