const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;


const getFileKeyFromS3Link = (s3Link) => {
    // https://horses-images-dev.s3.us-east-1.amazonaws.com/private/originImages/4221da51-4a16-4201-a2eb-f960b705925b.JPG
    try {
        const urlObj = new URL(s3Link);
        return urlObj.pathname.slice(1); // remove leading '/'
    } catch (err) {
        console.error("Invalid URL:", err.message);
        return null;
    }
}

module.exports = {
    s3,
    BUCKET_NAME,
    PutObjectCommand,
    GetObjectCommand,

    getFileKeyFromS3Link,
}