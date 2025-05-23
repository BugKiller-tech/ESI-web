const express = require('express');
const controller = require('../controllers/stripeCheckoutController');
const bodyValidatorMiddleware = require('../middleware/bodyValidatorMiddleware');
const Joi = require('joi');

const router = express.Router();


router.post('/create-checkout-session', bodyValidatorMiddleware(Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    // shippingAddress: Joi.string().allow('').optional(),
    street: Joi.string().allow('').optional(),
    city: Joi.string().allow('').optional(),
    state: Joi.string().allow('').optional(),
    zipCode: Joi.string().allow('').optional(),
    cartItems: Joi.any().required(),
})), controller.createStripeCheckoutSession);



module.exports = router;