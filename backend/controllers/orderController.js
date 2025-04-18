const mongoose = require('mongoose');
const OrderModel = require('../models/OrderModel');


const getOrdersWithPagination  = async (req, res) => {
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

const updateOrderStatus = async(req, res) => {
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


module.exports = {
    getOrdersWithPagination,
    getOneOrder,
    updateOrderStatus,
}

