const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const EmailsController = require("../controllers/emails");

const results = express.Router();

// POST
results.post("/", [token, fbAuth, userAuth], EmailsController.sendEmail);

module.exports = results;
