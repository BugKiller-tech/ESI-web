const express = require("express");
const weekUserController = require("../controllers/weekUserController");


const router = express.Router();

router.post('/get-weeks-for-state',
    // adminCheckMiddleware,
    weekUserController.getWeeksForState
);

module.exports = router;
