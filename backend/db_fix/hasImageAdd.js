const {
    establishDbConnection,
} = require('../config/db');
require('dotenv').config();
const WeekHorseInfoModel = require('../models/WeekHorseInfoModel');





establishDbConnection().then(async () => {
    console.log('Connected to MongoDB');

    const weekHorseInfos = await WeekHorseInfoModel.find({});
    console.log('record is', weekHorseInfos.length);
    for (const w of weekHorseInfos) {
        await w.updateHasImageInfo();
    }
    console.log('======================== DONE FOR IT =======================')
})



