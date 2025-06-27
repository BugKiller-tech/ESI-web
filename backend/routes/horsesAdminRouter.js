const express = require('express');
const controller = require('../controllers/horsesController');
const adminCheckMiddleware = require('../middleware/adminMiddleware');


const router = express.Router();

router.use(adminCheckMiddleware);

router.get('/:weekId/horse-names', controller.getAllHorsesForAdmin);
router.get('/:weekId/horses/:horseNumber', controller.getHorseImagesForAdmin);
router.delete('/:weekId/horses/:horseImageId/delete', controller.deleteHorseImage);
router.delete('/:weekId/horses/:horseNumber/delete-all-images', controller.deleteHorse);
router.post('/:weekId/horses/change-horse-number-for-images', controller.changeHorseNumberForImages);


module.exports = router;