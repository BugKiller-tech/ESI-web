
const WeekModel = require('../models/WeekModel');
const HorsesImageModel = require('../models/HorsesImageModel');


const getAllHorsesForAdmin = async (req, res) => {
    try {
        const week = await WeekModel.findById(req.params.weekId);
        if (!week) {
            return res.status(400).json({
                'message': 'Week not found'
            })
        }
        const horses = await HorsesImageModel.find({
            week: req.params.weekId,
        }).distinct('horseNumber');
        return res.json({
            week: week,
            horses: horses
        })
    } catch (error) {
        console.log('Error fetching horses:', error);
        return res.status(400).json({
            'message': 'Failed to get horses'
        })
    }
}

const getHorseImagesForAdmin = async (req, res) => {
    try {
        console.log({
            week: req.params.weekId,
            horseNumber: req.params.horseNumber
        })
        const horseImages = await HorsesImageModel.find({
            week: req.params.weekId,
            horseNumber: req.params.horseNumber
        });
        console.log('test me on', horseImages)
        return res.json({
            horseImages: horseImages
        })
    } catch (error) {
        console.log('Error fetching horse images:', error);
        return res.status(400).json({
            'message': 'Failed to get horse images'
        })
    }
}


module.exports = {
    getAllHorsesForAdmin,
    getHorseImagesForAdmin
}
