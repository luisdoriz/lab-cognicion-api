const express = require('express');

const auth = require('../../middleware/auth');
const PatientsController = require('../../controllers/patients');

const patients = express.Router();

// GET
patients.get('/', auth.valid, PatientsController.getPatients);
patients.get('/:id', auth.valid, PatientsController.getPatientById);

module.exports = patients;