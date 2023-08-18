const mongoose = require("mongoose");

const environments = {
  testing: process.env.MONGODB_URL,
  development: process.env.MONGODB_URL,
};
mongoose.connect(environments[process.env.NODE_ENV]);

const Result = mongoose.model(
  "Result",
  new mongoose.Schema({
    end: Date,
    start: Date,
    rule: String,
    name: String,
    type: Number,
    order: Number,
    idTest: Number,
    device: String,
    idUser: Number,
    config: Number,
    targets: Array,
    patient: Number,
    results: Object,
    startTime: Date,
    endTime: String,
    createdAt: Date,
    updatedAt: Date,
    estimulos: Array,
    accesUrl: Object,
    movements: Array,
    idPatient: Number,
    finished: Boolean,
    idTestType: Number,
    idMultitest: Number,
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
    clave: String,
    claveTarget: Number,
    noClaveTarget: Number,
    claveNoTarget: Number,
    noClaveNoTarget: Number,
    administracion: String,
    discos: Number,
    sonidoError: Boolean,
    mensajeError: Boolean,
    estimulosPrueba: Number,
    leftKey: String,
    rightKey: String,
    coherencia: Number,
  })
);

module.exports = { Result, Survey, Setting };
