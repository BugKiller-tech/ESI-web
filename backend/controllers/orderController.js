const mongoose = require('mongoose');
const archiver = require('archiver');
const stream = require('stream');
const path = require('path');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const OrderModel = require('../models/OrderModel');
const {
    INVOICES_PATH
} = require('../constants/constants')

const {
    ORDER_STATUS
} = require('../constants/constants');

const {
    s3,
    BUCKET_NAME,
    getFileKeyFromS3Link,
    GetObjectCommand,
} = require('../lib/s3Client');

const {
    createInvoicePDFWithPdfKit,
    createInvoicePdfWithPuppeteer
} = require('../lib/invoicePdf');
const {
    createImagesZipForResponsePipe
} = require("../lib/imageZipLib");


const getOrdersWithPagination = async (req, res) => {
    try {
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const search = req.body.search || '';

        console.log('getOrdersWithPagination');
        console.log(page, limit, search);

        const response = await OrderModel.aggregatePaginate(
            OrderModel.aggregate([
                {
                    $addFields: {
                    //   yearStr: { $toString: "$year" },
                        fullName: { $concat: ['$firstName', ' ', '$lastName'] }
                    }
                },
                {
                    $match: {
                        // isDeleted: 0,
                        orderStatus: {
                            $ne: ORDER_STATUS.Draft,
                        },
                        $or: [
                            { "fullName": { "$regex": search, "$options": "i" } },
                            // { "email": { "$regex": search, "$options": "i" } },
                            // { "weekNumber": { "$regex": search, "$options": "i" } },
                        ]
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    }
                }
            ]),
            {
                page: page,
                limit: limit,
            }
        );

        console.log('total order counts are like', response.totalDocs);

        return res.json({
            orders: response.docs,
            totalCount: response.totalDocs,
        })
    } catch (error) {
        console.log('Error fetching orders:', error);
        return res.status(400).json({
            'message': 'Failed to get orders'
        })
    }
}

const getOneOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findOne({
            _id: new mongoose.Types.ObjectId(orderId),
        })
        if (order) {
            return res.json({
                order: order,
            })
        }
        return res.status(400).json({
            message: 'Failed to find order'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'failed to fetch order',
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const newStatus = req.body.orderStatus;

        if (!orderId || !newStatus) {
            return res.status(400).json({
                message: 'Please provide valid information'
            })
        }

        const order = await OrderModel.findOne({
            _id: new mongoose.Types.ObjectId(String(orderId)),
        })

        order.orderStatus = newStatus;
        await order.save();
        return res.json({
            order: order,
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to update'
        })
    }
}

const downloadImagesZip = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findOne({
            _id: new mongoose.Types.ObjectId(orderId),
        })
        if (!order) {
            return res.status(400).json({
                message: 'Failed to find order'
            })
        }

        

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=images.zip`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', err => res.status(500).send({ error: err.message }));
        archive.pipe(res);

        const s3Links = order.cartItems.map(item => {
            return item.horse?.originImageS3Link
        })
        let imagesData = s3Links.map((link, index) => {
            const item = order.cartItems[index];
            const { horse, product } = item;
            const extension = link.split(".").pop();

            return {
                s3Link: link,
                fileName: `Horse#${horse?.horseNumber}_Product#${product?.category}_${product?.name}_Photoname#${horse?.originImageName}_Quantity#${item.quantity}.${extension}`,
            }
        });
        await createImagesZipForResponsePipe(archive, imagesData);

        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to download',
        })
    }
}

const downloadInvoice = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await OrderModel.findOne({
            _id: new mongoose.Types.ObjectId(orderId),
        })
        if (!order) {
            return res.status(400).json({
                message: 'Failed to find order'
            })
        }

        let filePath;
        if (!order.invoicePdf) {
            // await createInvoicePDFWithPdfKit(order, path.resolve(process.cwd(), `${INVOICES_PATH}/${order._id}.pdf`));
            filePath = await createInvoicePdfWithPuppeteer(order, path.resolve(process.cwd(), `${INVOICES_PATH}/${order._id}.pdf`));
            order.invoicePdf = filePath
            await order.save();
        } else {
            filePath = order.invoicePdf
        }
        res.download(filePath, `Order_${order._id}.pdf`);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to download',
        })
    }
}


const refundOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        // Fetch the order from DB
        const order = await OrderModel.findById(orderId);

        if (!order || !order.paymentIntentId) {
            return res.status(404).json({ error: 'Order not found or not paid' });
        }

        // Call Stripe to create a refund
        const refund = await stripe.refunds.create({
            payment_intent: order.paymentIntentId,
        });

        // Update the order status
        order.orderStatus = ORDER_STATUS.Refunded;
        await order.save();

        res.json({ order: order });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to refund',
        })
    }
}


module.exports = {
    getOrdersWithPagination,
    getOneOrder,
    updateOrderStatus,
    downloadImagesZip,
    downloadInvoice,
    refundOrder,
}

