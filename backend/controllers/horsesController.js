const mongoose = require("mongoose");
const archiver = require('archiver');

const WeekModel = require("../models/WeekModel");
const HorsesImageModel = require("../models/HorsesImageModel");
const {
    createImagesZipForResponsePipe
} = require("../lib/imageZipLib");

const getAllHorsesForAdmin = async (req, res) => {
    try {
        const week = await WeekModel.findById(req.params.weekId);
        if (!week) {
            return res.status(400).json({
                message: "Week not found",
            });
        }


        const result = await HorsesImageModel.aggregate([
            {
                $addFields: {
                    horseNumberNum: {
                        // $toInt: "$horseNumber" 
                        $convert: {
                            input: "$horseNumber",
                            to: "int",
                            onError: 0,
                            onNull: 0
                        }
                    }
                }

            },
            {
                // Group by horseNumber to get one doc per number
                $group: {
                    _id: "$horseNumber",        // group key (original string horseNumber)
                    doc: { $first: "$$ROOT" }   // get the first matching document
                }
            },
            {
                // Unpack the document back from 'doc'
                $replaceRoot: { newRoot: "$doc" }
            },
            {
                // Sort by numeric version of horseNumber
                $sort: { horseNumberNum: 1 }
            }
        ]);
        // Now use Mongoose's `populate` manually via `Model.populate`
        const horses = await HorsesImageModel.populate(result, { path: "horseInfo" });
        console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT', horses);

        return res.json({
            week: week,
            horses: horses,
        })



        // const horses = await HorsesImageModel.find({
        //     week: req.params.weekId,
        //     isDeleted: 0,
        // }).distinct("horseNumber");

        // let sortedHorseNumbers = horses
        //     .map((h) => {
        //         try {
        //             return Number(h);
        //         } catch (e) {
        //             return -1;
        //         }
        //     })
        //     .filter((h) => h != -1);
        // sortedHorseNumbers.sort((a, b) => a - b);

        // return res.json({
        //     week: week,
        //     horses: sortedHorseNumbers.map((h_num) => {
        //         if (h_num == 0) {
        //             return "0000";
        //         }
        //         return String(h_num);
        //     }),
        // });
    } catch (error) {
        console.log("Error fetching horses:", error);
        return res.status(400).json({
            message: "Failed to get horses",
        });
    }
};

const getHorseImagesForAdmin = async (req, res) => {
    try {
        console.log({
            week: req.params.weekId,
            horseNumber: req.params.horseNumber,
        });
        const horseImages = await HorsesImageModel.find({
            week: req.params.weekId,
            horseNumber: req.params.horseNumber,
            isDeleted: 0,
        }).sort({
            photoTakenTime: -1,
            createdAt: -1,
        });

        return res.json({
            horseImages: horseImages,
        });
    } catch (error) {
        console.log("Error fetching horse images:", error);
        return res.status(400).json({
            message: "Failed to get horse images",
        });
    }
};

const deleteHorseImage = async (req, res) => {
    try {
        const { weekId, horseImageId } = req.params;
        if (!weekId || !horseImageId) {
            return res.status(400).json({
                week: weekId,
                message: "failed to find image",
            });
        }
        const horse = await HorsesImageModel.findOne({
            week: weekId,
            _id: horseImageId,
        });
        if (horse) {
            horse.isDeleted = 1;
            await horse.save();
        } else {
            return res.status(400).json({
                message: "Failed to find image",
            });
        }
        return res.json({
            message: "success",
        });
    } catch (error) {
        console.log("Error fetching horse images:", error);
        return res.status(400).json({
            message: "Failed to get horse images",
        });
    }
};

const deleteHorse = async (req, res) => {
    try {
        const { weekId, horseNumber } = req.params;
        if (!weekId || !horseNumber) {
            return res.status(400).json({
                week: weekId,
                message: "Please provide the valid information",
            });
        }
        const horses = await HorsesImageModel.find({
            week: weekId,
            horseNumber: horseNumber,
        });
        for (const horse of horses) {
            horse.isDeleted = 1;
            await horse.save();
        }
        return res.json({
            message: "success",
        });
    } catch (error) {
        console.log("Error fetching horse images:", error);
        return res.status(400).json({
            message: "Failed to get horse images",
        });
    }
};

const changeHorseNumberForImages = async (req, res) => {
    try {
        const { weekId } = req.params;
        const { horseImageIds, newHorseNumber } = req.body;

        console.log("data received is just like");
        console.log(horseImageIds);
        console.log(newHorseNumber);

        const horseImages = await HorsesImageModel.find({
            _id: {
                $in: horseImageIds.map(
                    (id) => new mongoose.Types.ObjectId(String(id))
                ),
            },
        });
        for (const horseImage of horseImages) {
            horseImage.horseNumber = newHorseNumber;
            await horseImage.save();
        }

        return res.json({
            message: "Successfully changed horse number for selected images",
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to perform an action to change horse number",
        });
    }
};

const searchImagesByImageNumber = async (req, res) => {
    try {
        let imageNumbers = req.body.imageNumbers;
        const weekId = req.body.weekId;

        if (!imageNumbers) {
            imageNumbers = [];
        }
        const horseImages = await HorsesImageModel.find({
            week: new mongoose.Types.ObjectId(String(weekId)),
            originImageName: {
                $in: imageNumbers,
            },
        }).sort({
            photoTakenTime: -1,
        });

        return res.json({
            horseImages: horseImages,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to perform an action to change horse number",
        });
    }
};

const downloadForSelectedImages = async (req, res) => {
    try {
        const {
            imageIds
        } = req.body;

        if (!imageIds || imageIds.length == 0) {
            return res.status(400).json({
                message: 'Please provide the valid information to download'
            })
        }
        const horseImages = await HorsesImageModel.find({
            _id: {
                $in: imageIds,
            }
        });
        if (!horseImages) {
            return res.status(400).json({
                message: "Failed to find images",
            });
        }

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename=images.zip`);

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", (err) =>
            res.status(500).send({ error: err.message })
        );
        archive.pipe(res);

        const s3Links = horseImages.map((item) => {
            return item.originImageS3Link;
        });
        let imagesData = s3Links.map((link, index) => {
            const horse = horseImages[index];
            const extension = link.split(".").pop();

            return {
                s3Link: link,
                fileName: `Horse#${horse?.horseNumber}_Photoname#${horse?.originImageName}.${extension}`,
            };
        });
        await createImagesZipForResponsePipe(archive, imagesData);
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Failed to download",
        });
    }
};

module.exports = {
    getAllHorsesForAdmin,
    getHorseImagesForAdmin,
    deleteHorseImage,
    deleteHorse,
    changeHorseNumberForImages,
    searchImagesByImageNumber,
    downloadForSelectedImages,
};
