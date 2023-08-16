const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const SurveysController = require("../controllers/surveys");

const results = express.Router();

// POST
results.post("/", [token, fbAuth, userAuth], SurveysController.postSurvey);
results.post(
  "/answer",
  [token, fbAuth, userAuth],
  SurveysController.postSurveyAnswer
);

// GET
results.get("/", [token, fbAuth, userAuth], SurveysController.getSurveys);
results.get(
  "/search",
  [token, fbAuth, userAuth],
  SurveysController.searchSurveys
);
results.get(
  "/types",
  [token, fbAuth, userAuth],
  SurveysController.getSurveyTypes
);
results.get("/:id", [token, fbAuth, userAuth], SurveysController.getSurvey);

module.exports = results;
