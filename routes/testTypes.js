const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const TestTypesController = require("../controllers/testTypes");

const results = express.Router();

// GET
results.get("/", [token, fbAuth, userAuth], TestTypesController.getTestTypes);

module.exports = results;
