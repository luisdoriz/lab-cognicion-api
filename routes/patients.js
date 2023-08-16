const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const PatientsController = require("../controllers/patients");

const patients = express.Router();

// GET
patients.get("/", [token, fbAuth, userAuth], PatientsController.getPatients);
patients.get("/search/email", PatientsController.getPatientByEmail);
patients.get(
  "/:id",
  [token, fbAuth, userAuth],
  PatientsController.getPatientById
);

// PUT
patients.put("/:id", PatientsController.putPatient);

// POST
patients.post("/", PatientsController.postPatient);

// POST
patients.delete(
  "/:id",
  [token, fbAuth, userAuth],
  PatientsController.deletePatient
);

module.exports = patients;
