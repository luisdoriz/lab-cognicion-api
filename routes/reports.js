const express = require("express");
const ReportsControllers = require("../controllers/reports");
const reports = express.Router();

reports.get("/:idTest", ReportsControllers.createReportHanoi);

module.exports = reports;
