const {
    s3,
    BUCKET_NAME,
    getFileKeyFromS3Link,
    GetObjectCommand,
} = require('../lib/s3Client');

const createImagesZipForResponsePipe = async (archive, imagesData) => {
    try {
        if (!archive) {
            return;
        }
        let index = 0;
        const s3FileKeys = imagesData.map(item => getFileKeyFromS3Link(item.s3Link));
        for (const fileKey of s3FileKeys) {
            const command = new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: fileKey,
            });

            const data = await s3.send(command);

            if (!data.Body || typeof data.Body.pipe !== "function") {
                throw new Error(`Failed to stream S3 object: ${key}`);
            }        
            const fileName = imagesData[index].fileName
            archive.append(data.Body, { name: fileName });
            index++;
        }
        await archive.finalize();
    } catch (error) {}
};

module.exports = {
    createImagesZipForResponsePipe,
};
