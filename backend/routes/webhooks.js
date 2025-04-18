const express = require('express');
const Joi = require('joi');
const OrderModel = require('../models/OrderModel');
const mongoose = require('mongoose');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { convertStripeStatusToOurStatus } = require('../lib/stripe_convention');


const router = express.Router();

router.post('/stripe-hook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
    } catch (err) {
        console.log('Error stripe webhook', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'charge.refunded':
            const chargeRefunded = event.data.object;
            // Then define and call a function to handle the event charge.refunded
            break;
        case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed
            console.log('checkout session complete hook data', checkoutSessionCompleted);
            const order = await OrderModel.findOne({
                _id: new mongoose.Types.ObjectId(checkoutSessionCompleted.metadata?.orderId)
            })
            if (order) {
                order.paymentIntentId = checkoutSessionCompleted.payment_intent;
                order.paymentStatus = checkoutSessionCompleted.payment_status;
                order.orderStatus = convertStripeStatusToOurStatus(checkoutSessionCompleted.status);
                if (!order.stripeCustomerId) {
                    order.stripeCustomerId = checkoutSessionCompleted.customer;
                }
                order.orderedAt = new Date(checkoutSessionCompleted.created * 1000);
                await order.save();

            }
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
});


module.exports = router;
