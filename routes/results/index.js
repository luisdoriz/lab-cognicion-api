const express = require('express');

const auth = require('../../middleware/auth');
const ResultsController = require('../../controllers/results');

const results = express.Router();

// Post
results.post('/', auth.valid, ResultsController.postUser);

module.exports = results;