const express = require('express');
const controller = require('../controllers/horsesController');


const router = express.Router();

router.get('/:weekId/horse-names', controller.getAllHorsesForAdmin);

router.get('/:weekId/horses/:horseNumber', controller.getHorseImagesForAdmin);


module.exports = router;