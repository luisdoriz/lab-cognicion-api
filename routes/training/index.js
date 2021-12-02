const express = require("express");
const TrainingControllers = require("../../controllers/training");

const router = express.Router();

// GET
router.get("/", TrainingControllers.getParams);

module.exports = router;
