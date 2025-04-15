require('dotenv').config();

const imageProcessingQueueWithFtpOption = require('./queue');

const {
    establishDbConnection,
    createDefaultDbData,
} = require('./config/db');
establishDbConnection()
    .then(() => {
        console.log('db connection is established');
    }).catch(error => {
        console.log(error);
    })

const {
    imageProcessingJobUploadedViaFtp
} = require("./lib/ImageProcessor");



imageProcessingQueueWithFtpOption.client.on('ready', async () => {
    
// })
// (async () => {

    try {
        await imageProcessingQueueWithFtpOption.pause();

        // Remove all failed jobs (optional: adjust state types as needed)
        const states = ['failed', 'wait', 'delayed', 'completed', 'active'];

        for (const state of states) {
            const jobs = await imageProcessingQueueWithFtpOption.clean(0, state);
            console.log(`🧹 Cleared ${jobs.length} ${state} jobs`);
        }
        await imageProcessingQueueWithFtpOption.resume();
    } catch (err) {
        console.error('⚠️ Error cleaning queue on start:', err);
    }

    imageProcessingQueueWithFtpOption.on('ready', async () => {
        try {
            await imageProcessingQueueWithFtpOption.pause();
            await imageProcessingQueueWithFtpOption.obliterate({ force: true });
            await imageProcessingQueueWithFtpOption.resume();
            console.log('Queue successfully cleared.');
        } catch (err) {
            console.error('Failed to obliterate queue:', err);
        }
    })


    imageProcessingQueueWithFtpOption.on('completed', () => {
        console.log('worker job is completed!');
    });

    imageProcessingQueueWithFtpOption.on('failed', async (job, error) => {
        console.log('worker job is failed!');
        // Remove the failed job from the queue
        try {
            await job.remove();
            console.log(`🗑️ Job ${job.id} removed from queue after failure.`);
        } catch (removeErr) {
            console.error(`⚠️ Failed to remove job ${job.id}:`, removeErr);
        }

    });

    imageProcessingQueueWithFtpOption.process(async (job) => {
        const { _id } = job.data;
        try {
            await imageProcessingJobUploadedViaFtp(_id);
        } catch (error) {
            console.log('very quick job failure is detected');
            console.log(error);
        }
    });
})
