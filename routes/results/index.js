const express = require('express');

const auth = require('../../middleware/auth');
const ResultsController = require('../../controllers/results');

const results = express.Router();

// POST
results.post('/', auth.valid, ResultsController.postResult);

// GET
results.get('/', auth.valid, ResultsController.getResults);

module.exports = results;