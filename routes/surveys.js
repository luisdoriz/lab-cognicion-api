const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const SurveysController = require("../controllers/surveys");
const {
  validAccessUrlOrFirebase,
  validAccessUrl,
} = require("../middleware/accessUrl");

const results = express.Router();

// POST
results.post("/", [token, fbAuth, userAuth], SurveysController.postSurvey);
results.post(
  "/answer",
  [token, validAccessUrl],
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
results.get(
  "/:id",
  [token, validAccessUrlOrFirebase],
  SurveysController.getSurvey
);

module.exports = results;
