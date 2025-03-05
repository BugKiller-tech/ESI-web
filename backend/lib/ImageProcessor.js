const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { Jimp } = require('jimp');
const exifParser = require('exif-parser');

const ImageProcessModel = require('../models/ImageProcessModel');

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

// Generate a unique filename with timestamp
function generateUniqueImageFileName(extension = 'jpg') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${timestamp}.${extension}`;
}


const imageProcessingJobForWeek = async (weekNumber) => {
    try {
        imageRecords = await ImageProcessModel.find({
            weekNumber,
            isProcessed: 0,
        })

        const thumbWebImageSize = { width: 700, height: 700 };

        const watermarkImgSharp = await sharp(path.resolve(process.cwd(), 'uploads/watermark/WEB_WMARK-300x300.png'));
        const watermarkImgBufferForThumbWeb = await watermarkImgSharp
            .resize(thumbWebImageSize.width, thumbWebImageSize.height, { fit: 'cover'})
            .toBuffer();

        // console.log('BBBBBBBBBBBBBBBBBBBB', watermarkImgSharp)
        // const watermarkImgSharp1 = await sharp(path.resolve(process.cwd(), 'uploads/watermark/WEB_WMARK-300x300.png'));
        const watermarkImgBufferForThumbnail = await watermarkImgSharp.resize(400, 400).toBuffer();

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
                    // console.log('exifparser result', result);
                    const { width, height } = result.imageSize;
                    const dateTimeOriginal = result.tags.DateTimeOriginal;
                    const dateImageTaken = new Date(dateTimeOriginal * 1000);
                    console.log(
                        `Date image taken (hkg debug)==>
                            width: ${width}, height: ${height}, date image taken: ${dateImageTaken}`, dateImageTaken);

                    // console.log('Image path is like', record.imagePath);
                    try {
                        const processedThumbWebImg = await sharp(imageBuffer)
                            .resize(thumbWebImageSize.width, thumbWebImageSize.height, { fit: 'cover', position: 'top' })
                            .composite([{
                                input: watermarkImgBufferForThumbWeb,
                                gravity: 'centre',
                                blend: 'over'
                            }])
                            .jpeg({ quality: 90 })
                            .toFile(`uploads/processedImages/thumbWeb/${record.imageFileName}_${generateUniqueImageFileName()}`);
                    } catch (err) {
                        console.log('ererererre', err);
                    }

                    const processedThumbnailImg = await sharp(imageBuffer).resize(400, 400).composite([{
                        input: watermarkImgBufferForThumbnail,
                        gravity: 'center',
                        blend: 'over'
                    }]).jpeg().toFile(`uploads/processedImages/thumbnail/${ record.imageFileName }__${generateUniqueImageFileName()}`);

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
}