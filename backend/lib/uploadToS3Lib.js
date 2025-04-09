const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const crypto = require('crypto');
const mime = require('mime-types');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Upload function
const uploadToS3 = async (fullFilePath, s3Path, isPublic) => {
    if (!fs.existsSync(fullFilePath)) {
        throw new Error('File does not exist: ' + fullFilePath);
    }

    let max_retries = 3;

    while(true) {
        if (max_retries == 0) {
            return '';
        }

        try {
            const key = `${s3Path}/${crypto.randomUUID()}${path.extname(fullFilePath)}`;

            const fileStream = fs.createReadStream(fullFilePath);
            const contentType = mime.lookup(fullFilePath) || 'image/jpeg'; // Auto-detect or fallback
            const params = {
                Bucket: BUCKET_NAME,
                Key: key,
                Body: fileStream,
                ContentType: contentType,
                // ACL: isPublic ? "public-read" : "private",  // using bucket policy instead
            };
        
            await s3.send(new PutObjectCommand(params));
            return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        } catch (error) {
            console.log(error);
        }
        max_retries--;
    }
};



const uploadAllImagesToS3 = async (
    originImagePath,
    thumbWebImgPath,
    thumbnailImgPath,
) => {
    try {
        let originImageS3Link = await uploadToS3(originImagePath, 'private/originImages', false);
        // let originImageS3Link = await uploadToS3(thumbnailImgPath, 'private/originImages', false);
        let thumbWebS3Link = await uploadToS3(thumbWebImgPath, 'public/thumbwebs', true);
        let thumbnailS3Link = await uploadToS3(thumbnailImgPath, 'public/thumbnails', true);

        try {
            fs.unlinkSync(originImagePath);
            fs.unlinkSync(thumbWebImgPath);
            fs.unlinkSync(thumbnailImgPath)
        } catch (err) {
            console.log('Error deleting files from the local server after s3 upload', err);
        }
        return {
            originImageS3Link,
            thumbWebS3Link,
            thumbnailS3Link,
        }
    } catch (error) {
        console.log(error);
    }
    return null;
}
module.exports = {
    uploadToS3,
    uploadAllImagesToS3
}