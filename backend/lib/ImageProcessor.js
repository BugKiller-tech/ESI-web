const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Jimp } = require('jimp');
const exifParser = require('exif-parser');

const FtpImagesProcessModel = require('../models/FtpImagesProcessModel');
const mongoose = require('mongoose');
const ProjectSettingModel = require('../models/ProjectSettingModel');
const constants = require('../config/constants');
const { getAllImagesFromFtpFolder } = require('../lib/ftpAccess');


async function getImageBuffer(imagePath) {
    try {
        // Read the image file as a buffer
        const filePath = path.resolve(process.cwd(), imagePath);
        // const data = await fs.readFile();
        const data = fs.readFileSync(filePath);
        return data;
    } catch (err) {
        console.error('Error reading the image file:', err);
        return null;
    }
}

async function getImageBufferFromFullPath(imageFullPath) {
    try {
        const data = fs.readFileSync(imageFullPath);
        return data;
    } catch (err) {
        console.error('Error reading the image file:', err);
        return null;
    }
}

// Generate a unique filename with timestamp
function generateUniqueImageFileName(extension = 'jpg') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${timestamp}.${extension}`;
}

async function getSettings () {
    const setting = await ProjectSettingModel.findOne({});
        
    let watermarkUrl = 'public/watermark/default-watermark.png';
    let thumbnailPercentage = 5;
    let thumbWebPercentage = 25;

    if (setting) {
        if (setting.watermarkImage) {
            watermarkUrl = setting.watermarkImage
        }
        if (setting.imageSetting.thumbWebPercentage) {
            thumbWebPercentage = setting.imageSetting.thumbWebPercentage;
        }
        if (setting.imageSetting.thumbnailPercentage) {
            thumbnailPercentage = setting.imageSetting.thumbnailPercentage;
        }
    }
    return {
        watermarkUrl,
        thumbWebPercentage,
        thumbnailPercentage
    }
    
}


const imageProcessingJobForWeek = async (weekNumber) => {
    try {
        imageRecords = await ImageProcessModel.find({
            weekNumber,
            isProcessed: 0,
        })

        
        const {
            watermarkUrl,
            thumbWebPercentage,
            thumbnailPercentage
        } = await getSettings();

        const watermarkImgSharp = await sharp(path.resolve(process.cwd(), watermarkUrl));


        let errorMsg = 'Failed to process some images\n';
        for ([index, record] of imageRecords.entries()) {
            try {
                const imageBuffer = await getImageBuffer(record.imagePath);
                // const imageBuffer = await sharp(path.resolve(process.cwd(), record.imagePath)).toBuffer();
                if (imageBuffer) {
                    // const metadata = await sharp(imageBuffer).metadata();
                    // console.log('meta data is something like', metadata);

                    // Parse EXIF metadata
                    const parser = exifParser.create(imageBuffer);
                    const result = parser.parse();
                    console.log('exifparser result', result);
                    let { width, height } = result.imageSize;
                    const dateTimeOriginal = result.tags.DateTimeOriginal;
                    const orientation = result.tags?.Orientation | 0
                    // Orientation referencevalues
                    // 1 = Normal (no rotation needed)
                    // 3 = 180° rotation (upside-down)
                    // 6 = 90° clockwise rotation (portrait mode)
                    // 8 = 90° counterclockwise rotation (portrait mode)
                    if (orientation == 6 || orientation == 8) { // swap width and height
                        width = result.imageSize.height
                        height = result.imageSize.width
                    }

                    const dateImageTaken = new Date(dateTimeOriginal * 1000);
                    console.log(
                        `Date image taken (hkg debug)==>
                            width: ${width}, height: ${height}, date image taken: ${dateImageTaken}`, dateImageTaken);

                        const thumbWebWidth = Math.round(width / 100 * thumbWebPercentage)
                        const thumbWebHeight = Math.round(height / 100 * thumbWebPercentage)

                        const watermarkImgBufferForThumbWeb = await watermarkImgSharp
                        .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover'})
                        .toBuffer();

                    // console.log('Image path is like', record.imagePath);
                    try {
                        
                        const thumbWebPath = `${constants.thumbwebPath}/${record.imageFileName}_${generateUniqueImageFileName()}`
                        const processedThumbWebImg = await sharp(imageBuffer)
                            .rotate()
                            .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover', position: 'centre' })
                            .composite([{
                                input: watermarkImgBufferForThumbWeb,
                                gravity: 'centre',
                                blend: 'over'
                            }])
                            .jpeg({ quality: 75 })
                            .toFile(thumbWebPath);
                    } catch (err) {
                        console.log('error on', err);
                    }

                    const thumbnailWidth = Math.round(width / 100 * thumbnailPercentage)
                    const thumbnailHeight = Math.round(height / 100 * thumbnailPercentage)
                    console.log('thumbnail final size will be', thumbnailWidth, thumbnailHeight);
                    const watermarkImgBufferForThumbnail = await watermarkImgSharp.resize(thumbnailWidth, thumbnailHeight).toBuffer();

                    
                    const thumbnailPath = `${constants.thumbnailPath}/${ record.imageFileName }__${generateUniqueImageFileName()}`
                    const processedThumbnailImg = await sharp(imageBuffer)
                        .rotate()
                        .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover', position: 'centre' })
                        .composite([{
                            input: watermarkImgBufferForThumbnail,
                            gravity: 'center',
                            blend: 'over'
                        }])
                        .jpeg({ quality: 75 })
                        .toFile(thumbnailPath);

                    record.isProcessed = 1;
                    await record.save();


                } else {
                    console.log('can not read image')
                }
            } catch (e) {
                errorMsg += `\n Image file name is ${ record.imageFileName }`
                console.log(e);
            }
        }

    } catch (e) {
        console.log(e);
        return Promise.reject({
            'message': errorMsg
        })
    }
}



const imageProcessingJobUploadedViaFtp = async (_id) => {
    let errorMsg = 'Failed to process some images\n';
    try {
        record = await FtpImagesProcessModel.findOne({
            _id: new mongoose.Types.ObjectId(_id),
        })
        if (record.isProcessed) {
            console.log('Already processed for this ftp folder');
            return;
        }

        const {
            watermarkUrl,
            thumbWebPercentage,
            thumbnailPercentage
        } = await getSettings();

        const watermarkImgSharp = await sharp(path.resolve(process.cwd(), watermarkUrl));

        const images = await getAllImagesFromFtpFolder(record.ftpFolderName);
  
        for ([index, imageInfo] of images.entries()) {
            try {
                const imageBuffer = await getImageBufferFromFullPath(imageInfo.imagePath);
                // const imageBuffer = await sharp(path.resolve(process.cwd(), imageInfo.imagePath)).toBuffer();
                if (imageBuffer) {
                    // const metadata = await sharp(imageBuffer).metadata();
                    // console.log('meta data is something like', metadata);

                    // Parse EXIF metadata
                    const parser = exifParser.create(imageBuffer);
                    const result = parser.parse();
                    console.log('exifparser result', result);
                    let { width, height } = result.imageSize;
                    const dateTimeOriginal = result.tags.DateTimeOriginal;
                    const orientation = result.tags?.Orientation | 0
                    // Orientation referencevalues
                    // 1 = Normal (no rotation needed)
                    // 3 = 180° rotation (upside-down)
                    // 6 = 90° clockwise rotation (portrait mode)
                    // 8 = 90° counterclockwise rotation (portrait mode)
                    if (orientation == 6 || orientation == 8) { // swap width and height
                        width = result.imageSize.height
                        height = result.imageSize.width
                    }

                    const dateImageTaken = new Date(dateTimeOriginal * 1000);
                    console.log(
                        `Date image taken (hkg debug)==>
                            width: ${width}, height: ${height}, date image taken: ${dateImageTaken}`, dateImageTaken);

                        const thumbWebWidth = Math.round(width / 100 * thumbWebPercentage)
                        const thumbWebHeight = Math.round(height / 100 * thumbWebPercentage)

                        const watermarkImgBufferForThumbWeb = await watermarkImgSharp
                        .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover'})
                        .toBuffer();

                    // console.log('Image path is like', imageInfo.imagePath);
                    try {
                        
                        const thumbWebPath = `${constants.thumbwebPath}/${imageInfo.imageFileName}_${generateUniqueImageFileName()}`
                        const processedThumbWebImg = await sharp(imageBuffer)
                            .rotate()
                            .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover', position: 'centre' })
                            .composite([{
                                input: watermarkImgBufferForThumbWeb,
                                gravity: 'centre',
                                blend: 'over'
                            }])
                            .jpeg({ quality: 75 })
                            .toFile(thumbWebPath);
                    } catch (err) {
                        console.log('error on', err);
                    }

                    const thumbnailWidth = Math.round(width / 100 * thumbnailPercentage)
                    const thumbnailHeight = Math.round(height / 100 * thumbnailPercentage)
                    console.log('thumbnail final size will be', thumbnailWidth, thumbnailHeight);
                    const watermarkImgBufferForThumbnail = await watermarkImgSharp.resize(thumbnailWidth, thumbnailHeight).toBuffer();

                    
                    const thumbnailPath = `${constants.thumbnailPath}/${ imageInfo.imageFileName }__${generateUniqueImageFileName()}`
                    const processedThumbnailImg = await sharp(imageBuffer)
                        .rotate()
                        .resize(thumbnailWidth, thumbnailHeight, { fit: 'cover', position: 'centre' })
                        .composite([{
                            input: watermarkImgBufferForThumbnail,
                            gravity: 'center',
                            blend: 'over'
                        }])
                        .jpeg({ quality: 75 })
                        .toFile(thumbnailPath);

                    record.isProcessed = 1;
                    await record.save();


                } else {
                    console.log('can not read image')
                }
            } catch (e) {
                errorMsg += `\n Image file name is ${ record.imageFileName }`
                console.log(e);
            }
        }

    } catch (e) {
        console.log(e);
        return Promise.reject({
            'message': errorMsg
        })
    }
}



module.exports = {
    imageProcessingJobForWeek,
    imageProcessingJobUploadedViaFtp,
}