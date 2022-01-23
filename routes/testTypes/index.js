const express = require("express");

const auth = require("../../middleware/auth");
const TestTypesController = require("../../controllers/testTypes");

const results = express.Router();

// GET
results.get("/", auth.valid, TestTypesController.getTestTypes);

module.exports = results;
