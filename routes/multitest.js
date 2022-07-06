const express = require("express");
const {
  getMultiTest,
  getAllMultiTests,
  getMultiTestPatient,
} = require("../controllers/multitest");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth.valid, getAllMultiTests);

router.get("/:idMultiTest", getMultiTest);

router.get("/:idMultiTest/patient/:idPatient", getMultiTestPatient);

module.exports = router;
