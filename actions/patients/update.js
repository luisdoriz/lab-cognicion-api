const models = require("../../models");

const { Patient } = models;

const updatePatient = async (ids, body) => Patient.update(body, { where: ids });

module.exports = {
  updatePatient,
};
