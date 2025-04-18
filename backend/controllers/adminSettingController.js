const ProjectSettingModel = require('../models/ProjectSettingModel');
const commonDbFuncs = require('../lib/common_db_func');

const getImageProcessSetting = async (req, res) => {
    try {
        const setting = await ProjectSettingModel.findOne({});
        if (!setting) {
            return res.status(404).json({
                message: 'No setting found'
            })
        }
        return res.json({
            imageSetting: setting.imageSetting
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Error fetching setting'
        })
    }
}

const updateImageSetting = async (req, res) => {
    try {
        const setting = await ProjectSettingModel.findOne({});
        if (!setting) {
            const newSetting = new ProjectSettingModel({
                imageSetting: req.body.imageSetting
            });
            await newSetting.save();
        } else {
            setting.imageSetting = req.body.imageSetting;
            await setting.save();
        }
        return res.json({
            message: 'Image setting updated successfully'
        })
    } catch (error) {
        return res.status(500).json({
            'message': 'Can not update image setting'
        })
    }
}

const getWatermarkImage = async (req, res) => {
    try {
        const setting = await ProjectSettingModel.findOne({});
        if (!setting || !setting.watermarkImage) {
            return res.status(404).json({
                message: 'No setting found'
            })
        }
        return res.json({
            watermarkImage: setting.watermarkImage,
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Failed to get watermark image'
        })
    }
}

const uploadWatermarkImage = async (req, res) => {
    console.log('test for watermamrk image upload', req.file);
    try {
        if (req.file) {
            const setting = await ProjectSettingModel.findOne({});
            setting.watermarkImage = req.file.path;
            await setting.save();
            return res.json({
                message: 'Watermark image uploaded successfully',
                imageUrl: setting.watermarkImage
            })
        }
    } catch (error) {
        console.log('upload watermark error', error);
    }
    return res.status(400).json({
        message: 'Failed to upload watermark image'
    })
}

const getTaxAndShippingFee = async (req, res) => {
    try {
        const setting = await commonDbFuncs.getTaxAndShippingFee();
        if (!setting) {
            return res.status(404).json({
                message: 'No setting found'
            })
        }
        return res.json(setting)
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            'message': 'Failed to fetch',
        })
    }
}

const updateTaxAndShippingFee = async (req, res) => {
    try {
        const setting = await ProjectSettingModel.findOne({});
        if (!setting) {
            return res.status(404).json({
                message: 'No setting found'
            })
        }
        setting.tax = req.body.tax;
        setting.flatShippingFee = req.body.flatShippingFee;
        await setting.save();
        return res.json({
            message: 'Succesfully updated',
        })
        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            'message': 'Failed to fetch',
        })
    }
}

module.exports = {
    getImageProcessSetting,
    updateImageSetting,
    getWatermarkImage,
    uploadWatermarkImage,
    getTaxAndShippingFee,
    updateTaxAndShippingFee,
}
