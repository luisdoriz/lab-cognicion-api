const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://api:roble219@cluster0.qiohz.mongodb.net/tests?retryWrites=true&w=majority"
);

const Result = mongoose.model("Result", new mongoose.Schema());

const Survey = mongoose.model("Survey", new mongoose.Schema());

const Setting = mongoose.model("Setting", new mongoose.Schema());

module.exports = { Result, Survey, Setting };
