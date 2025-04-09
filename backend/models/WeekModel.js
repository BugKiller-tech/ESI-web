const mongoose = require('mongoose');
// const mongoosePaginate = require('mongoose-paginate-v2');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const schema = new mongoose.Schema({
    state: {
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
    isDeleted: {
        type: Number,
        default: 0,
    }
})

// schema.plugin(mongoosePaginate);
schema.plugin(aggregatePaginate);

module.exports = mongoose.model('Weeks', schema);
