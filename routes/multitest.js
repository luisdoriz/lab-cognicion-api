const express = require("express");
const { getMultiTest, getAllMultiTests } = require("../controllers/multitest");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth.valid, getAllMultiTests);

router.get("/:idMultiTest", getMultiTest);

module.exports = router;
