const express = require('express');

const auth = require('../../middleware/auth');
const TestsController = require('../../controllers/tests');

const results = express.Router();

// POST
results.post('/', auth.valid, TestsController.createTest);
results.post('/results', auth.valid, TestsController.postResult);

// GET
results.get('/', auth.valid, TestsController.getResults);
results.get('/:id', auth.valid, TestsController.getResult);

module.exports = results;