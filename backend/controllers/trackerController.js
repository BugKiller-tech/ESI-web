const FtpImageProcessModel = require('../models/FtpImagesProcessModel');
const {
    FTP_IMAGE_PROCESSOR_JOB_STATUS
} = require('../constants/constants');


const getFtpImageProcessStatusWithTaskId = async (req, res) => {
    try {
        let taskId = req.params.taskId;

        let record  = await FtpImageProcessModel.findById(taskId);
        if (record) {
            return res.json({
                progressVal: record.progressVal || 0,
                unsortedImagesCount: record.unsortedImagesCount || 0,
                totalImagesCount: record.totalImagesCount || 0,
                status: record.status || FTP_IMAGE_PROCESSOR_JOB_STATUS.PROGRESS,
            })
        } else {
            return res.status(400).json({
                message: 'Failed to fetch job status',
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: 'Failed to fetch job status',
        })
    }
}

module.exports = {
    getFtpImageProcessStatusWithTaskId,
}
