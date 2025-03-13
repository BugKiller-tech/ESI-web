const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const schema = new mongoose.Schema({
    name: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: '',
    },
    isDigitalProduct: {
        type: Boolean,
        default: false,
    },
    price: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Number,
        default: 0,
    }
})

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('ProductsModel', schema);
