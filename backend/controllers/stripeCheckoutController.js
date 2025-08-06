require('dotenv').config();
const mongoose = require('mongoose');
const ProductsModel = require('../models/ProductsModel');
const OrderModel = require('../models/OrderModel');
const commonDbFuncs = require('../lib/common_db_func');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


const makeLineItemsForStripe = async (cartItems) => {
    try {
        const setting = await commonDbFuncs.getTaxAndShippingFee();
        if (!setting) {
            console.log('setting is not ready yet')
            return null;
        }


        const product_ids = cartItems.map(item => item.product?._id);
        const products = await ProductsModel.find({  // To avoid frauds
            _id: {
                $in: product_ids.map(id => new mongoose.Types.ObjectId(String(id)))
            }
        })

        let detectedFraud = false;
        let productNotFound = false;
        const cleanedCartItems = cartItems.map(item => {
            const p = products.find(p => p._id == item.product?._id);
            if (!p) {
                productNotFound = true;
            }

            if (p.price != item.product?.price) {
                detectedFraud = true;
            }

            return {
                ...item,
                product: p,
            }
        })
        if (productNotFound) {
            console.log('product not found~~~~~~~~~~~');
            return null;
        }

        let line_items = [];

        let subTotal = 0;
        let totalForPrints = 0;
        let needDelivery = false;
        
        cleanedCartItems.map((item) => {
            const { product } = item;
            console.log('pppppppppppppppppppppppppppppppppp roduct is ', item);
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${product.category} - ${ product.name }`,
                    },
                    unit_amount: Math.round(product.price * 100), // in cents
                },
                quantity: item.quantity,
            });

            subTotal += ( item.quantity * product.price );
            if (!product.isDigitalProduct) {
                console.log('EEEEEEEEEEEEEEEE', item.quantity, product.price);
                totalForPrints += ( item.quantity * product.price )
            }
            if (!product.isDigitalProduct) {
                needDelivery = true;
            }
        });

        const taxAmount = ( totalForPrints / 100 * setting.tax );
        const shippingFee = taxAmount > 0 ? setting.flatShippingFee : 0;

        if (taxAmount > 0) {
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Tax`,
                    },
                    unit_amount: Math.round(taxAmount * 100), // in cents
                },
                quantity: 1
            })
            line_items.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Shipping`,
                    },
                    unit_amount: Math.round(shippingFee * 100), // in cents
                },
                quantity: 1,
            })
        }
        const paidTotal = subTotal + taxAmount + shippingFee;

        return {
            line_items,
            subTotal,
            taxAmount,
            shippingFee,
            paidTotal,
        }


    } catch (error) {
        console.log(error);
        return null;
    }
}

const createStripeCheckoutSession = async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length == 0) {
            return res.status(400).json({
                message: 'Invalid request'
            })
        }

        const data = await makeLineItemsForStripe(cartItems);
        if (!data) {
            return res.status(400).json({
                message: 'Please provide valid cart information to create'
            })
        }

        const {
            line_items,
            subTotal,
            taxAmount,
            shippingFee,
            paidTotal,
        } = data;

        const shippingAddress = `${req.body.street} ${req.body.city} ${req.body.state}`;
        const order = new OrderModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            
            shippingAddress: shippingAddress || '', // combination of street, city, state
            street: req.body.street || '',
            city: req.body.city || '',
            state: req.body.state || '',
            zipCode: req.body.zipCode || '',
            
            cartItems: cartItems,
            subTotal: subTotal,
            taxAmount: taxAmount,
            shippingFee: shippingFee,
            paidTotal: paidTotal,
        })
        await order.save();

        // Lookup customer by email (you need to store Stripe customer IDs to do this efficiently)
        const existingCustomers = await stripe.customers.list({
            email: req.body.email,
            limit: 1,
        });

        let customer;
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
        } else {
            customer = await stripe.customers.create({ email: req.body.email });
        }


        console.log('line items is like', line_items);
        
        
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            // payment_method_types: ['card'],
            mode: 'payment',
            line_items: line_items,
            metadata: {
                orderId: String(order._id),
            },
            success_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${order._id}`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
        });

        order.stripeCustomerId = customer.id;
        order.stripeCheckoutSessionId = session.id;
        await order.save();

        console.log('check for the response ~~~~~~~~~', session);
        console.log('payment_intent is like like', session.payment_intent);

        res.json({ url: session.url });

    } catch (error) {
        console.log(error);

        return res.status(400).json({
            message: 'Failed to create stripe checkout'
        })
    }
}


module.exports = {
    createStripeCheckoutSession,
}