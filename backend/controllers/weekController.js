const WeekModel = require('../models/WeekModel');

const getWeeksWithPagination  = async (req, res) => {
    try {
        const page = req.body.page || 1;
        const limit = req.body.limit || 10;
        const search = req.body.search || '';

        const response = await WeekModel.aggregatePaginate(
            WeekModel.aggregate([
                {
                    $addFields: {
                      yearStr: { $toString: "$year" }
                    }
                },
                {
                    $match: {
                        // isDeleted: 0,
                        $or: [
                            { "state": { "$regex": search, "$options": "i" } },
                            { "yearStr": { "$regex": search, "$options": "i" } },
                            { "weekNumber": { "$regex": search, "$options": "i" } },
                        ]
                    },
                },
                {
                    $sort: {
                        year: -1,
                        weekNumber: -1,
                    }
                }
            ]),
            {
                page: page,
                limit: limit,
            }
        );

        return res.json({
            categories: response.docs,
            totalCount: response.totalDocs,
        })
    } catch (error) {
        console.log('Error fetching categories:', error);
        return res.status(400).json({
            'message': 'Failed to get categories'
        })
    }
}

const updateVisibility = async (req, res) => {
    try {
        const _id = req.body._id;
        const isDeleted = req.body.isDeleted;

        if (!_id) {
            return res.status(400).json({
                'message': 'week ID is required'
            })
        }

        await WeekModel.updateOne({ _id: _id }, { $set: { isDeleted: isDeleted } });

        return res.json({
            'message': 'week visibility updated successfully'
        })
    } catch (error) {
        console.log('Error updating week visibility:', error);
        return res.status(400).json({
            'message': 'Failed to update week visibility'
        })
    }
}


module.exports = {
    getWeeksWithPagination,
    updateVisibility,
}