const express = require("express");
const controller = require('../controllers/horseUserController');


const router = express.Router();



router.post('/get-horses-for-week', controller.getHorsesForWeek);


module.exports = router;
