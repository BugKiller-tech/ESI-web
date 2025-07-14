const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const ImageProcessModel = require('../models/ImageProcessModel');
const ProjectSettingModel = require('../models/ProjectSettingModel');
const FtpImageProcessModel = require('../models/FtpImagesProcessModel');
const WeekHorseInfoModel = require('../models/WeekHorseInfoModel');
const HorsesImageModel = require('../models/HorsesImageModel');

const {
    imageProcessingJobForWeek,
    imageProcessingJobUploadedViaFtp
} = require('../lib/ImageProcessor');
const { listTopLevelFolders } = require('../lib/ftpAccess');
const imageProcessingQueueWithFtpOption = require('../queue');
const WeekModel = require('../models/WeekModel');





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

const getHorsesFtpFolders = async (req, res) => {
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



function mergeHorseData(originData, newData) {
    const horseNamesDataMap = new Map();

    // Populate map with original data
    for (const horse of originData) {
        horseNamesDataMap.set(horse.horseNumber, horse);
    }

    // Merge new data
    for (const horse of newData) {
        const existingHorse = horseNamesDataMap.get(horse.horseNumber);

        if (!existingHorse) {
            // Add new horse name record if not found in original
            horseNamesDataMap.set(horse.horseNumber, horse);
        } else if (existingHorse.horseName !== horse.horseName) {
            // Update horse name if different
            existingHorse.horseName = horse.horseName;
        }
    }

    // Return merged result as array
    return Array.from(horseNamesDataMap.values());
}


const updateHorseInfos = async (week) => {
    try {
        const horseNamesInfo = JSON.parse(week.horseNamesData);

        // let bulkOps = [];
        // for (const horseInfo of horseNamesInfo) {
        //     bulkOps.push({
        //         updateOne: {
        //             filter: {
        //                 week: week._id,
        //                 horseNumber: horseInfo.horseNumber,
        //             },
        //             update: {
        //                 $set: {
        //                     horseName: horseInfo.horseName,
        //                     riderName: horseInfo.riderName,
        //                 }
        //             },
        //             upsert: true,
        //         }
        //     })                        
        // }
        // await WeekHorseInfoModel.bulkWrite(bulkOps);

        for (const horseInfo of horseNamesInfo) {
            const record = await WeekHorseInfoModel.findOneAndUpdate(
                {
                    week: week._id,
                    horseNumber: horseInfo.horseNumber,

                },
                {
                    $set: {
                        horseName: horseInfo.horseName,
                        riderName: horseInfo.riderName,
                    }

                },
                {
                    upsert: true, new: true
                }
            );

            const result = await HorsesImageModel.updateMany(
                {
                    week: week._id,
                    horseNumber: record.horseNumber,
                    isDeleted: 0,
                },
                {
                    $set: {
                        horseInfo: record._id
                    }
                },
                // { upsert: true }
            );
            if (result.matchedCount > 0) { // modifiedCount
                record.hasImages = true;
                await record.save();
            }

        }
    } catch (error) {
        console.log(error);
    }
}

const readHorseNamesFromExcelAndUpdateWeek = async (filePath, week) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const newHorseNamesData = XLSX.utils.sheet_to_json(sheet, {
            header: ['horseNumber', 'horseName', 'riderName'],
            range: 1,
        });
        console.log('horse names are like', newHorseNamesData);
        fs.unlinkSync(filePath);

        let existingHorseNamesData = [];
        if (week.horseNamesData) {
            existingHorseNamesData = JSON.parse(week.horseNamesData);
        }
        const horseNamesData = mergeHorseData(existingHorseNamesData, newHorseNamesData);
        week.horseNamesData = JSON.stringify(horseNamesData);
        await week.save();

        updateHorseInfos(week);
    } catch (error) {
        console.log(error);
    }
}

const uploadHorseNamesExcelAction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Failed to find excel file you uploaded',
            })
        }
        const filePath = req.file.path;
        const {
            weekId
        } = req.body;

        const week = await WeekModel.findOne({
            _id: weekId,
        })
        if (!week) {
            return res.status(400).json({
                message: 'Failed to find proper week',
            })
        }

        await readHorseNamesFromExcelAndUpdateWeek(filePath, week);
        return res.json({
            message: 'Successful'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to upload or parsing for horse names excel',
        })
    }
}

const uploadHorseNamesExcelForUpcomingWeekAction = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: 'Failed to find excel file you uploaded',
            })
        }
        const filePath = req.file.path;
        const {
            year,
            state,
            weekNumber,
        } = req.body;

        let week = await WeekModel.findOne({
            year: year,
            state: state,
            weekNumber: weekNumber,
        })
        if (!week) {
            week = new WeekModel({
                year: year,
                state: state,
                weekNumber: weekNumber,
            })
            await week.save();
        }

        await readHorseNamesFromExcelAndUpdateWeek(filePath, week);
        return res.json({
            message: 'Successful'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to upload or parsing for horse names excel',
        })
    }
}

module.exports = {
    // uploadImages,
    uploadTimeStampJsonWithFtpFolder,
    getHorsesFtpFolders,
    uploadHorseNamesExcelAction,
    uploadHorseNamesExcelForUpcomingWeekAction,
}