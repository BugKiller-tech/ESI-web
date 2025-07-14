const mongoose = require('mongoose');

const WeekModel = require('../models/WeekModel');
const HorsesImageModel = require('../models/HorsesImageModel');
const WeekHorseInfoModel = require('../models/WeekHorseInfoModel');

const ObjectId = mongoose.Types.ObjectId;


const searchHorseByNumber = async (req, res) => {
    try {
        const { weekId, horseNumber } = req.body;

        if (!weekId || !horseNumber) {
            return res.status(400).json({
                message: 'Please provide valid information',
            });
        }

        const horses = await HorsesImageModel.find({
            week: new ObjectId(String(weekId)),
            // horseNumber: { "$regex": horseNumber, "$options": "i" }
            horseNumber: horseNumber.trim(),
            isDeleted: 0,
        }).sort({
            createdAt: -1,
        }).limit(2);

        if (horses.length > 0) {
            const week = await WeekModel.findById(weekId);
            return res.status(200).json({
                message: 'Horses fetched successfully',
                horse: horses[0],
                week: week,
            });
        } else {
            return res.status(400).json({
                message: 'Can not find the horse with the number you entered.',
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}

const searchHorsesByName = async (req, res) => {
    try {
        const { weekId } = req.body;
        let horseNameToSearch = req.body.horseNameToSearch;

        if (!weekId) {
            return res.status(400).json({
                message: 'Please provide valid information',
            });
        }
        if (!horseNameToSearch) {
            horseNameToSearch = '';
        }

        
        let matchQueries = {
            week: new ObjectId(String(weekId)),
            hasImages: true,
        }

        if (horseNameToSearch) {
            const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            matchQueries.horseName = {
                $regex: new RegExp(escapeRegex(horseNameToSearch), 'i')
            }
        }
        const weekHorses = await WeekHorseInfoModel.find(matchQueries).sort({
            horseName: 1,
        });
        
        // let matchQueries = {
        //     week: new ObjectId(String(weekId)),
        //     images: { $ne: [] } // only those that are referenced
        // }
        // const weekHorses = await WeekHorseInfoModel.aggregate([
        //     {
        //         $lookup: {
        //             from: 'horsesimagemodels', // this is real db collection name not model name
        //             localField: '_id',
        //             foreignField: 'horseInfo',
        //             as: 'images'
        //         }
        //     },
        //     {
        //         $match: matchQueries
        //     },
        //     {
        //         $project: {
        //             images: 0 // remove the joined images if you don't need them
        //         }
        //     }
        // ]).sort({
        //     horseName: 1,
        // })


        const week = await WeekModel.findById(weekId);

        return res.json({
            week: week,
            horses: weekHorses,
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
}



const getHorsesForWeek = async (req, res) => {
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
            isDeleted: 0,
        }).sort({
            photoTakenTime: -1,
            createdAt: -1,
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
    searchHorseByNumber,
    searchHorsesByName,
    getHorsesForWeek,
    getHorseImagesByWeekAndHorseNumber,
}
