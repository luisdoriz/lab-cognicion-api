const express = require('express');

const auth = require('../../middleware/auth');
const EmailsController = require('../../controllers/emails');

const results = express.Router();

// POST
results.post('/', auth.valid, EmailsController.sendEmail);

module.exports = results;