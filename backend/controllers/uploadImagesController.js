const fs = require('fs');
const path = require('path');
const ImageProcessModel = require('../models/ImageProcessModel');
const ProjectSettingModel = require('../models/ProjectSettingModel');
const { imageProcessingJobForWeek } = require('../lib/ImageProcessor');


const uploadImages = async (req, res) => {
    console.log('Horse images are like', req.files.horseImages);
    console.log('json file is like', req.files.timestampJson);

    if (req.files?.horseImages?.length == 0 || req.files?.timestampJson?.length == 0){
        return res.status(400).json({
            message: 'Please provide valid files'
        })
    }
    const jsonFile = req.files.timestampJson[0];

    let weekNumber = '';
    try {
        const jsonRawData = fs.readFileSync(path.resolve(process.cwd(), jsonFile.path));
        const jsonData = JSON.parse(jsonRawData);
        weekNumber = jsonData.weekNumber;
    } catch (e) {
        console.log(e);
        return res.status(400).json({
            'message': 'your json file is not correct'
        })
    }
    if (!weekNumber) {
        return res.status(400).json({
            message: 'Please provide valid json file which has weekNumber & entries'
        })
    }

    for (const img of req.files.horseImages){
        console.log('imgimgimg', img);
        const entry = new ImageProcessModel({
            weekNumber: weekNumber,
            jsonPath: jsonFile.path,
            imagePath: img.path,
            imageFileName: img.filename,
        })
        await entry.save();
    }
    imageProcessingJobForWeek(weekNumber)
    .then(response => {
        console.log('image procesing job is done.')
        // Send email to admin about reporting images are processed for the specific weekNum
    })
    .catch(error => {
        console.log('image processing job is incomplete', error)
    });

    return res.json({
        'message': 'Successfully uploaded all images and image process will be executed in background',
    })
    // sharp(imageBuffer)
    // .metadata()
    // .then((metadata) => {
    //   console.log('Exif Data:', metadata); // Metadata contains Exif info including time taken
    //   const dateTime = metadata.exif ? metadata.exif.DateTimeOriginal : 'Unknown';
    //
    //   // Resize image and add watermark
    //   sharp(imageBuffer)
    //     .resize(800) // Resize image to width of 800px
    //     .composite([{
    //       input: Buffer.from(
    //         `<svg width="200" height="60">
    //            <text x="10" y="30" font-size="30" fill="white">Watermark</text>
    //          </svg>`
    //       ),
    //       gravity: 'southeast' // Position watermark at the bottom right
    //     }])
    //     .toBuffer()
    //     .then((outputBuffer) => {
    //       // Save the image or send it back as response
    //       res.type('image/png');
    //       res.send(outputBuffer);
    //     })
    //     .catch(err => {
    //       res.status(500).send({ error: 'Error processing image', details: err });
    //     });
    // })
    // .catch(err => {
    //   res.status(500).send({ error: 'Error reading Exif data', details: err });
    // });
    
    return res.json({
        'message': 'Success',
    })
}


module.exports = {
    uploadImages
}