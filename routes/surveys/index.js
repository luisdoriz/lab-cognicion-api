const express = require('express');

const auth = require('../../middleware/auth');
const SurveysController = require('../../controllers/surveys');

const results = express.Router();

// POST
results.post('/', auth.valid, SurveysController.postSurveyAnswer);

// GET
results.get('/', auth.valid, SurveysController.getSurveys);
results.get('/:id', auth.valid, SurveysController.getSurvey);
// results.get('/types', auth.valid, TestsController.getSurveyTypes);

module.exports = results;