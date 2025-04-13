const mongoose = require('mongoose');
const HorsesImageModel = require('../models/HorsesImageModel');
const ObjectId = mongoose.Types.ObjectId;

const getHorsesByWeekId = async (weekId) => {
    try {
        if (!weekId) {
            return res.status(400).json({
                message: 'Week ID is required',
            });
        }

        const horses = await HorsesImageModel.aggregate([
            {
                $match: {
                    week: new ObjectId(String(weekId)),
                },
            },
            {
                $sort: {
                    photoTakenTime: 1,
                    createdAt: 1,
                },
            },
            {
                $group: {
                    _id: "$horseNumber",
                    doc: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$doc" } } // Flatten the output
        ]);
        console.log('QQQQQQQQQQQQ', horses);
        // const horses = await HorsesImageModel.find({ week: weekId }).sort({
        //     photoTakenTime: 1,
        //     createdAt: 1,
        // });

        return horses;
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching horses by week ID');
    }
}


module.exports = {
    getHorsesByWeekId,
}