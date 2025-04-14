const mongoose = require('mongoose');
const { getHorsesByWeekId } = require('../services/horseService');

const HorsesImageModel = require('../models/HorsesImageModel');

const ObjectId = mongoose.Types.ObjectId;

const getHorsesForWeek = async ( req, res ) => {
    try {
        console.log('req body tttttttttttttttttt', req.body);
        const { weekId } = req.body;

        if (!weekId) {
            return res.status(400).json({
                message: 'Week ID is required',
            });
        }

        // Assuming you have a function to fetch horses based on weekId
        const horses = await getHorsesByWeekId(weekId);

        return res.status(200).json({
            message: 'Horses fetched successfully',
            horses: horses,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const getHorseImagesByWeekAndHorseNumber = async (req, res) => {
    try {
        const {
            weekId,
            horseNumber,
        } = req.body;
        if (!weekId || !horseNumber) {
            return res.status(400).json({
                message: 'Week ID and Horse Number are required',
            });
        }
        const horses = await HorsesImageModel.find({
            week: weekId,
            horseNumber: horseNumber,
        }).sort({
            photoTakenTime: 1,
            createdAt: 1,
        });
        console.log('horses', horses);

        return res.json({
            horseImages: horses,
        })


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Internal server error',
        })
    }
}



module.exports = {
    getHorsesForWeek,
    getHorseImagesByWeekAndHorseNumber,
}
