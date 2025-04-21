const mongoose = require('mongoose');
const archiver = require('archiver');
const stream = require('stream');
const path = require('path');

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


const getOrdersWithPagination = async (req, res) => {
    try {
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const search = req.body.search || '';

        console.log('getOrdersWithPagination');
        console.log(page, limit, search);

        const response = await OrderModel.aggregatePaginate(
            OrderModel.aggregate([
                // {
                //     $addFields: {
                //       yearStr: { $toString: "$year" }
                //     }
                // },
                {
                    $match: {
                        // isDeleted: 0,
                        orderStatus: {
                            $ne: ORDER_STATUS.Draft,
                        },
                        $or: [
                            { "fullName": { "$regex": search, "$options": "i" } },
                            { "email": { "$regex": search, "$options": "i" } },
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

        const s3Links = order.cartItems.map(item => {
            return item.horse?.originImageS3Link
        })

        const s3FileKeys = s3Links.map(link => getFileKeyFromS3Link(link));
        // return res.json({
        //     links: s3Keys
        // })

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=images.zip`);

        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', err => res.status(500).send({ error: err.message }));

        archive.pipe(res);

        let index = 0;
        for (const fileKey of s3FileKeys) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
            });

            const data = await s3.send(command);

            if (!data.Body || typeof data.Body.pipe !== 'function') {
                throw new Error(`Failed to stream S3 object: ${key}`);
            }

            const item = order.cartItems[index]
            
            const extension = fileKey.split('.').pop();
            const fileName = `Horse#${item.horse?.horseNumber}_Product#${item.product?.category}_${item.product?.name}_Quantity#${item.quantity}.${extension}`;
            archive.append(data.Body, { name: fileName });
            index++;
        }
        await archive.finalize();
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


module.exports = {
    getOrdersWithPagination,
    getOneOrder,
    updateOrderStatus,
    downloadImagesZip,
    downloadInvoice,
}

