const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const PaymentsController = require("../controllers/payments");
const patients = express.Router();

// GET
patients.get("/", [token, fbAuth, userAuth], PaymentsController.getMyPayments);

// POST
patients.post("/", [token, fbAuth, userAuth], PaymentsController.createPayment);

// POST
patients.delete(
  "/:idPayment",
  [token, fbAuth, userAuth],
  PaymentsController.cancelPayment
);

module.exports = patients;
