const express = require("express");
const { getFile, createFile } = require("../controllers/files");
const auth = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/:file_id", getFile);

router.post("/", auth.valid, upload.single("file"), createFile);

module.exports = router;
