const mongoose = require("mongoose");

const environments = {
  testing: process.env.MONGODB_URL,
  development: process.env.MONGODB_URL,
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
    idUser: Number,
    idSurvey: Number,
    idPatient: Number,
    questions: Array,
    createdAt: Date,
    updatedAt: Date,
    observaciones: String,
  })
);

const Setting = mongoose.model(
  "Setting",
  new mongoose.Schema({
    idUser: Number,
    idTest: Number,
    idPatient: Number,
    idTestType: Number,
    tiempoExposicion: String,
    tiempoInterestimular: String,
    target: String,
    fontFamily: String,
    fontStyle: String,
    fontSize: String,
    color: String,
    backgroundColor: String,
    numeroEstimulos: Number,
    aparicion: String,
    keyCode: String,
    duracion: String,
    createdAt: Date,
    updatedAt: Date,
  })
);

module.exports = { Result, Survey, Setting };
