const mongoose = require('mongoose');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const {
    ORDER_STATUS
} = require('../constants/constants');

const schema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    shippingAddress: {
        type: String,
    },
    zipCode: {
        type: String,
        default: '',
    },
    cartItems: {
        type: Object,
    },

    subTotal: {
        type: Number,
    },
    taxAmount: {
        type: Number,
    },
    shippingFee: {
        type: Number,
    },
    paidTotal: {
        type: Number,
    },
    paymentStatus: {
        type: String,
    },
    paymentMethod: {
        type: String,
        default: 'stripe',
    },
    stripeCustomerId: {
        type: String,
        default: '',
    },
    stripeCheckoutSessionId: {
        type: String,
        default: '',
    },
    paymentIntentId: {
        type: String,
        default: '',
    },
    chargeId: {
        type: String,
        default: '',
    },
    orderedAt: {
        type: Date,

    },

    orderStatus: {
        type: String,
        default: ORDER_STATUS.Draft,
    }

}, {
    timestamps: true
})

schema.plugin(aggregatePaginate);


// Virtual for full name
schema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

schema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('orders', schema);