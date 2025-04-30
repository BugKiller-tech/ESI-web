
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
            isDeleted: 0,
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
            horseNumber: req.params.horseNumber,
            isDeleted: 0,
        });

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

const deleteHorseImage = async (req, res) => {
    try {
        const {
            weekId,
            horseImageId
        } = req.params;
        if (!weekId || !horseImageId) {
            return res.status(400).json({
                week: weekId,
                message: 'failed to find image'
            })
        }
        const horse = await HorsesImageModel.findOne({
            week: weekId,
            _id: horseImageId
        });
        if (horse) {
            horse.isDeleted = 1;
            await horse.save();
        } else {
            return res.status(400).json({
                message: 'Failed to find image',
            })
        }
        return res.json({
            message: 'success',
        })
    } catch (error) {
        console.log('Error fetching horse images:', error);
        return res.status(400).json({
            'message': 'Failed to get horse images'
        })
    }
}

const deleteHorse = async (req, res) => {
    try {
        const {
            weekId,
            horseNumber
        } = req.params;
        if (!weekId || !horseNumber) {
            return res.status(400).json({
                week: weekId,
                message: 'Please provide the valid information'
            })
        }
        const horses = await HorsesImageModel.find({
            week: weekId,
            horseNumber: horseNumber
        });
        for (const horse of horses) {
            horse.isDeleted = 1;
            await horse.save();
        }
        return res.json({
            message: 'success',
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
    getHorseImagesForAdmin,
    deleteHorseImage,
    deleteHorse,

}
