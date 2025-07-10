const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Jimp } = require('jimp');
const exifParser = require('exif-parser');
const { DateTime, Zone } = require("luxon");
const mongoose = require('mongoose');

const FtpImagesProcessModel = require('../models/FtpImagesProcessModel');
const ProjectSettingModel = require('../models/ProjectSettingModel');
const WeekModel = require('../models/WeekModel.js');
const HorsesImageModel = require('../models/HorsesImageModel.js');


const constants = require('../constants/constants.js');
const { getAllImagesFromFtpFolder, deleteFtpFolderAndFiles } = require('../lib/ftpAccess');
const { uploadAllImagesToS3 } = require('./uploadToS3Lib');
const {
    watermarkPath,
    FTP_IMAGE_PROCESSOR_JOB_STATUS
} = require('../constants/constants');


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
function generateUniqueImageFileName(extension = 'JPG') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${timestamp}.${extension}`;
}

async function getSettings() {
    const setting = await ProjectSettingModel.findOne({});

    let watermarkUrl = `${watermarkPath}/default.png`;
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

const saveHorseInfoToDb =  async (
    horseNumber,
    originImageName,
    record,
    originImageS3Link,
    thumbWebS3Link,
    thumbnailS3Link,
    aspectRatio,
    photoTakenTime,
) => {
    let week;
    week = await WeekModel.findOne({
        year: record.year,
        state: record.state,
        weekNumber: record.weekNumber,
    })
    if (!week) {
        week = new WeekModel({
            year: record.year,
            state: record.state,
            weekNumber: record.weekNumber,
        })
        await week.save();
    }
    if (week.isDeleted) { // if week is deleted but got image on it, then recover it as undeleted.
        week.isDeleted = 0;
        await week.save();
    }
    let imageRecord = new HorsesImageModel({
        week: week._id,
        horseNumber: horseNumber,
        originImageName: originImageName,
        originImageS3Link,
        thumbWebS3Link,
        thumbnailS3Link,
        aspectRatio,
        photoTakenTime: photoTakenTime,
    })
    await imageRecord.save();
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
                    let { width, height } = result.imageSize || {
                        width: 1000,
                        height: 1000,
                    };
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
                        .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover' })
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


                    const thumbnailPath = `${constants.thumbnailPath}/${record.imageFileName}__${generateUniqueImageFileName()}`
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
                errorMsg += `\n Image file name is ${record.imageFileName}`
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

const getJsonHorseEntries = (record) => {  // record is FtpImagesProcessModel document
    try {
        const rawData = record.imageJsonData
        const jsonData = JSON.parse(rawData);
        return jsonData.entries || [];
    } catch ( error ) {
        console.log('error parsing timestamp json file');
        return [];
    }
}

const getHorseNumberByPhotoTakenTime = (photoTakenTimeString, entries)=> {
    try {
        for (const entry of entries) {
            if (entry.startTime <= photoTakenTimeString && entry.endTime >= photoTakenTimeString) {
                return entry.horseNumber
            }
        }
    } catch (error) {
        console.log('Error on getHorseNumberByPhotoTakenTime function', error);
        return ''
    }
}


const imageProcessingJobUploadedViaFtp = async (_id) => {
    let errorMsg = '';
    try {
        record = await FtpImagesProcessModel.findOne({
            _id: new mongoose.Types.ObjectId(String(_id)),
        })
        if (!record) {
            console.log('can not find ftp process model record in db');
            return;
        }
        if (record.isProcessed) {
            console.log('Already processed for this ftp folder');
            return;
        }

        record.status = FTP_IMAGE_PROCESSOR_JOB_STATUS.PROGRESS;
        await record.save();

        const {
            watermarkUrl,
            thumbWebPercentage,
            thumbnailPercentage
        } = await getSettings();

        const horseJsonEntries = getJsonHorseEntries(record);
        // console.log('============ entries ==============', horseJsonEntries)

        const watermarkImgSharp = await sharp(path.resolve(process.cwd(), watermarkUrl));

        const images = await getAllImagesFromFtpFolder(record.ftpFolderName);

        const totalImagesCount = images.length;
        let unsortedImagesCount = 0;
        console.log(`We found ${totalImagesCount} images inside the folder.`)
        
        let processedImagesCount = 0;

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
                    // console.log('exifparser result', result);
                    let { width, height } = result.imageSize || {
                        width: 1000,
                        height: 1000,
                    };;
                    const dateTimeOriginal = result.tags?.DateTimeOriginal || 0;
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

                    // aspect ratio
                    let aspectRatio = 1;
                    if (height > 0) {
                        aspectRatio = Math.round(width / height * 100) / 100;
                    }


                    const dateImageTaken = new Date(dateTimeOriginal * 1000);
                    let dt = DateTime.fromMillis(dateTimeOriginal * 1000)
                    let inUtcTime = dt.setZone("UTC");
                    console.log(
                        `Date image taken (dev debug)==>
                            width: ${width}, height: ${height}, date image taken: ${dateImageTaken}`, inUtcTime.toFormat('yyyy-MM-dd HH:mm:ss'));
                    let horseNumber = getHorseNumberByPhotoTakenTime(inUtcTime.toFormat('yyyy-MM-dd HH:mm:ss'), horseJsonEntries);

                    if (!horseNumber) {
                        console.log('Can not find horse number inside json file 0000 will be horse #');
                        // continue;
                        horseNumber = '0000';
                        unsortedImagesCount += 1;
                    }

                    const originImageName = imageInfo.imageFileName.split('.')[0];
                    const newImageFileName = `${horseNumber}_${originImageName}`

                    const thumbWebWidth = Math.round(width / 100 * thumbWebPercentage)
                    const thumbWebHeight = Math.round(height / 100 * thumbWebPercentage)

                    const watermarkImgBufferForThumbWeb = await watermarkImgSharp
                        .resize(thumbWebWidth, thumbWebHeight, { fit: 'cover' })
                        .toBuffer();

                    // console.log('Image path is like', imageInfo.imagePath);
                    const thumbWebPath = `${constants.thumbwebPath}/${newImageFileName}_${generateUniqueImageFileName()}`
                    try {

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


                    const thumbnailPath = `${constants.thumbnailPath}/${newImageFileName}__${generateUniqueImageFileName()}`
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


                    console.log("Image processing is done", imageInfo.imagePath, thumbWebPath, thumbnailPath);
                    try {
                        console.log("Starting uploading images to s3");
                        const {
                            originImageS3Link,
                            thumbWebS3Link,
                            thumbnailS3Link,
                        } = await uploadAllImagesToS3(
                            imageInfo.imagePath,
                            path.resolve(process.cwd(), thumbWebPath),
                            path.resolve(process.cwd(), thumbnailPath),
                        );
                        await saveHorseInfoToDb(
                            horseNumber,
                            originImageName,
                            record,
                            originImageS3Link,
                            thumbWebS3Link,
                            thumbnailS3Link,
                            aspectRatio,
                            dateImageTaken,
                        )

                    } catch (err1) {
                        console.log(err1);
                    }
                    processedImagesCount++;
                } else {
                    console.log('can not read image')
                }
            } catch (e) {
                if (!errorMsg) {
                    errorMsg += 'Failed to process some images\n';
                }
                errorMsg += `\n Image file name is ${record.imageFileName}`
                console.log(e);
            }

            // Update progress into FtpImagesProcessModel
            record.progressVal = Math.round((index + 1 ) * 100 / totalImagesCount);
            await record.save();
        }
        record.unsortedImagesCount = unsortedImagesCount
        record.totalImagesCount = totalImagesCount
        record.status = FTP_IMAGE_PROCESSOR_JOB_STATUS.SUCCESS;
        record.progressVal = 100;
        await record.save();
        // if (!errorMsg) {
        //     record.isProcessed = 1;
        //     await record.save();
        // }
        
        if (!errorMsg) {
            deleteFtpFolderAndFiles(record.ftpFolderName);
        }

        console.log(`All done. processed for ${processedImagesCount} / ${totalImagesCount} images.`)

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