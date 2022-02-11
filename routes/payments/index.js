const express = require("express");
const auth = require("../../middleware/auth");
const PaymentsController = require("../../controllers/payments");
const patients = express.Router();

// GET
patients.get("/", auth.valid, PaymentsController.getMyPayments);

// POST
patients.post("/", auth.valid, PaymentsController.createPayment);

// POST
patients.delete("/:idPayment", auth.valid, PaymentsController.cancelPayment);

module.exports = patients;
