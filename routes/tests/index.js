const express = require('express');

const auth = require('../../middleware/auth');
const TestsController = require('../../controllers/tests');

const results = express.Router();

// POST
results.post('/', auth.valid, TestsController.createTest);
results.post('/results', auth.valid, TestsController.postResult);

// GET
results.get('/', auth.valid, TestsController.getResults);
results.get('/fiability', auth.valid, TestsController.getFiabilityTest);
results.get('/:id', auth.valid, TestsController.getResult);

module.exports = results;