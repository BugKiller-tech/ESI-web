const express = require("express");
const controller = require('../controllers/horseUserController');


const router = express.Router();



router.post('/get-horses-for-week', controller.getHorsesForWeek);
router.post('/get-horse-images-by-week-and-horsenumber', controller.getHorseImagesByWeekAndHorseNumber);


module.exports = router;
