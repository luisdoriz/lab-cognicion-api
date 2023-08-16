const express = require("express");
const { getFile, createFile } = require("../controllers/files");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.get("/:file_id", getFile);

router.post("/", [token, fbAuth, userAuth], upload.single("file"), createFile);

module.exports = router;
