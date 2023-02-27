const mongoose = require("mongoose");

const environments = {
  testing:
    "mongodb+srv://jmalvarezs:HulkingCone79@cluster0.duvbskx.mongodb.net/test",
  development:
    "mongodb+srv://api:roble219@cluster0.qiohz.mongodb.net/tests?retryWrites=true&w=majority",
};
mongoose.connect(environments[process.env.NODE_ENV]);

const Result = mongoose.model(
  "Result",
  new mongoose.Schema({
    idTest: Number,
    idPatient: Number,
    createdAt: Date,
    updatedAt: Date,
    device: String,
    end: Date,
    finished: Boolean,
    idUser: Number,
    movements: Array,
    start: Date,
    backgroundColor: String,
    coherencia: String,
    endTime: String,
    estimulos: Array,
    fontFamily: String,
    fontSize: String,
    fontStyle: String,
    idTestType: Number,
    numeroEstimulos: Number,
    startTime: Date,
    tiempoInterestimular: Number,
    config: Number,
    target: String,
    targets: Array,
    accesUrl: Object,
    id: Number,
    idMultitest: Number,
    name: String,
    order: Number,
    patient: Number,
    results: Object,
    type: Number,
  })
);

const Survey = mongoose.model(
  "Survey",
  new mongoose.Schema({
    idSurvey: Number,
    idPatient: Number,
  })
);

const Setting = mongoose.model(
  "Setting",
  new mongoose.Schema({
    idTest: Number,
    idPatient: Number,
  })
);

module.exports = { Result, Survey, Setting };
