const express = require("express");
const {
  getMultiTest,
  getAllMultiTests,
  getMultiTestPatient,
  getMultiTestReport,
} = require("../controllers/multitest");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", [token, fbAuth, userAuth], getAllMultiTests);

router.get("/:idMultiTest", getMultiTest);

router.get("/:idMultiTest/patient/:idPatient", getMultiTestPatient);

router.get("/:idMultiTest/report", getMultiTestReport);

module.exports = router;
