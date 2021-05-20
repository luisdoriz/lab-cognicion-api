const models = require("../../models");

const { Patient } = models;

const createPatient = async (body) => Patient.create(body);

module.exports = {
  createPatient,
};
