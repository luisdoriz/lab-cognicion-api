const express = require("express");

const auth = require("../../middleware/auth");
const SurveysController = require("../../controllers/surveys");

const results = express.Router();

// POST
results.post("/", auth.valid, SurveysController.postSurvey);
results.post("/answer", auth.valid, SurveysController.postSurveyAnswer);

// GET
results.get("/", auth.valid, SurveysController.getSurveys);
results.get("/search", auth.valid, SurveysController.searchSurveys);
results.get("/types", auth.valid, SurveysController.getSurveyTypes);
results.get("/:id", auth.valid, SurveysController.getSurvey);

module.exports = results;
