const express = require("express");

const auth = require("../../middleware/auth");
const TestsController = require("../../controllers/tests");

const results = express.Router();

// POST
results.post("/", auth.valid, TestsController.createTest);
results.post("/results", auth.valid, TestsController.postResult);
results.put("/results", auth.valid, TestsController.putResult);

// GET
results.get("/", auth.valid, TestsController.searchTests);
results.get("/single/:id", TestsController.getResult);
results.get(
  "/patient/:idPatient",
  auth.valid,
  TestsController.getAllPatientResults
);
results.get("/fiability", auth.valid, TestsController.getFiabilityTest);

module.exports = results;
