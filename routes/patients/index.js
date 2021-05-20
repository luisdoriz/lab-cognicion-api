const express = require('express');

const auth = require('../../middleware/auth');
const PatientsController = require('../../controllers/patients');

const patients = express.Router();

// GET
patients.get('/', auth.valid, PatientsController.getPatients);
patients.get('/:id', auth.valid, PatientsController.getPatientById);

// PUT
patients.put('/:id', auth.valid, PatientsController.putPatient);

// POST 
patients.post('/', auth.valid, PatientsController.postPatient);

// POST 
patients.delete('/:id', auth.valid, PatientsController.deletePatient);

module.exports = patients;