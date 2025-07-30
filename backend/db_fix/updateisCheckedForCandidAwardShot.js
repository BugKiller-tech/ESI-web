const {
    establishDbConnection,
} = require('../config/db');
require('dotenv').config();
const HorsesImageModel = require('../models/HorsesImageModel');





establishDbConnection().then(async () => {
    console.log('Connected to MongoDB');

    await HorsesImageModel.updateMany(
        {
            $or: [
                { horseNumber: { $regex: '^Award', $options: 'i' } },
                { horseNumber: { $regex: '^Candid', $options: 'i' } }
            ]
        },
        { $set: { isCheckedForCandidAwardShot: 1 } }
    );
    console.log('======================== DONE FOR IT =======================')
})



