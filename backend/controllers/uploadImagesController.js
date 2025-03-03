const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const exifParser = require('exif-parser');



async function getImageBuffer(imagePath) {
    try {
      // Read the image file as a buffer
    //   console.log('testing mode is on', process.cwd(), imagePath);
        const filePath = path.resolve(process.cwd(), imagePath);
        console.log('ASDFADFADFADFADFADF',filePath);
        // const data = await fs.readFile();
        const data = fs.readFileSync(filePath);
        console.log('Image buffer:', data);
        return data;
    } catch (err) {
        console.error('Error reading the image file:', err);
        return null;
    }
}

const uploadImages = async (req, res) => {
    console.log(req.files);

    try {

        if (req.files.length > 0) {
            const imageBuffer = await getImageBuffer(req.files[0].path);
            if (imageBuffer){
                console.log('image buffer is something like', imageBuffer);
                const metadata = await sharp(imageBuffer).metadata();
                console.log('meta data is something like', metadata);

                // Parse EXIF metadata
                const parser = exifParser.create(imageBuffer);
                const result = parser.parse();
                const dateTimeOriginal = result.tags.DateTimeOriginal;
                const dateImageTaken = new Date(dateTimeOriginal * 1000);

                console.log('date time ooooooooooorigin',dateImageTaken);

            }
        }
    } catch (e) {
        console.log(e);
    }
    return res.json({
        'message': 'testing mode',
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