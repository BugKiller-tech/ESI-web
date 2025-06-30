const fs = require('fs');
const path = require('path');
const ImageProcessModel = require('../models/ImageProcessModel');
const ProjectSettingModel = require('../models/ProjectSettingModel');
const FtpImageProcessModel = require('../models/FtpImagesProcessModel');

const {
    imageProcessingJobForWeek,
    imageProcessingJobUploadedViaFtp
} = require('../lib/ImageProcessor');
const { listTopLevelFolders } = require('../lib/ftpAccess');
const imageProcessingQueueWithFtpOption = require('../queue');





// const uploadImages = async (req, res) => {
//     console.log('Horse images are like', req.files.horseImages);
//     console.log('json file is like', req.files.timestampJson);
//     console.log('req body is like', req.body.state);
//     console.log('req itself itself', req);

//     if (req.files?.horseImages?.length == 0 || req.files?.timestampJson?.length == 0){
//         return res.status(400).json({
//             message: 'Please provide valid files'
//         })
//     }
//     const jsonFile = req.files.timestampJson[0];

//     let weekNumber = '';
//     try {
//         const jsonRawData = fs.readFileSync(path.resolve(process.cwd(), jsonFile.path));
//         const jsonData = JSON.parse(jsonRawData);
//         weekNumber = jsonData.weekNumber;
//     } catch (e) {
//         console.log(e);
//         return res.status(400).json({
//             'message': 'your json file is not correct'
//         })
//     }
//     if (!weekNumber) {
//         return res.status(400).json({
//             message: 'Please provide valid json file which has weekNumber & entries'
//         })
//     }

//     for (const img of req.files.horseImages){
//         const entry = new ImageProcessModel({
//             weekNumber: weekNumber,
//             jsonPath: jsonFile.path,
//             imagePath: img.path,
//             imageFileName: img.filename,
//         })
//         await entry.save();
//     }
//     imageProcessingJobForWeek(weekNumber)
//     .then(response => {
//         console.log('image procesing job is done.')
//         // Send email to admin about reporting images are processed for the specific weekNum
//     })
//     .catch(error => {
//         console.log('image processing job is incomplete', error)
//     });

//     return res.json({
//         'message': 'Successfully uploaded all images and image process will be executed in background',
//     })
 
// }


const uploadTimeStampJsonWithFtpFolder = async (req, res) => {
    console.log('json file is like', req.files.timestampJson);
    console.log('req body is like', req.body.state);
    console.log(req.body.ftpFolder);

    let jsonFile = null;
    if (req.files.timestampJson?.length > 0) {
        jsonFile = req.files.timestampJson[0];
    } else {
        return res.status(400).json({
            message: 'Failed to find timestamp json file'
        })
    }

    let weekNumber = req.body.weekNumber;
    const jsonRawData = fs.readFileSync(path.resolve(process.cwd(), jsonFile.path));
    if (!weekNumber) {
        try {
            const jsonData = JSON.parse(jsonRawData);
            weekNumber = jsonData.weekNumber;
        } catch (e) {
            console.log(e);
            return res.status(400).json({
                'message': 'your json file is not correct'
            })
        }
    }

    if (!weekNumber) {
        return res.status(400).json({
            message: 'Please provide valid json file which has weekNumber & entries'
        })
    }

    const found = await FtpImageProcessModel.findOne({
        ftpFolderName: req.body.ftpFolder,
    })

    if (found) {
        return res.status(400).json({
            message: 'Same folder name is processed before',
        })
    }
    
    const entry = new FtpImageProcessModel({
        state: req.body.state,
        year: req.body.year,
        weekNumber,
        ftpFolderName: req.body.ftpFolder,
        jsonPath: jsonFile.path,
        imageJsonData: jsonRawData,
    })
    const record = await entry.save();


    // imageProcessingJobUploadedViaFtp(record._id)
    // .then(response => {
    //     console.log('horse images uploaded via ftp are processed')
    // })
    // .catch(error => {
    //     console.log('the problem occurred during processig images uploaded via ftp')
    // })

    imageProcessingQueueWithFtpOption.add({
        _id: record._id,
    }).then(() => {
        console.log('done');
    })
    .catch(() => {
        console.log('error')
    });
    return res.json({
        taskId: record._id,
        message: 'Successfully uploaded all images and image process will be executed in background',
    })
}

const getHorsesFtpFolders = async ( req, res ) => {
    try {
        const folders = await listTopLevelFolders();
        return res.json({
            folders: folders,
        })
    } catch (error) {
        return res.status(400).json({
            message: 'Can not get access to the ftp'
        })
    }
}


module.exports = {
    // uploadImages,
    uploadTimeStampJsonWithFtpFolder,
    getHorsesFtpFolders,
}