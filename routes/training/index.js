const express = require("express");
const TrainingControllers = require("../../controllers/training");

const auth = require("../../middleware/auth");
const router = express.Router();

// POST

router.post("/params", TrainingControllers.calculateParams);

module.exports = router;
