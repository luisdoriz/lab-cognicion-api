const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const TestsController = require("../controllers/tests");
const {
  validAccessUrl,
  validAccessUrlOrFirebase,
} = require("../middleware/accessUrl");

const results = express.Router();

// POST
results.post("/", [token, fbAuth, userAuth], TestsController.createTest);
results.post("/results", [token, validAccessUrl], TestsController.postResult);
results.put("/results", [token, fbAuth, userAuth], TestsController.putResult);

// GET
results.get("/", [token, fbAuth, userAuth], TestsController.searchTests);
results.get(
  "/single/:idTest",
  [token, validAccessUrlOrFirebase],
  TestsController.getResult
);
results.get(
  "/patient/:idPatient",
  [token, fbAuth, userAuth],
  TestsController.getAllPatientResults
);
results.get(
  "/fiability",
  [token, fbAuth, userAuth],
  TestsController.getFiabilityTest
);

module.exports = results;
