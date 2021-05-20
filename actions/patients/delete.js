const models = require("../../models");

const { Patient } = models;

const deletePatient = async (id, idUser) =>
  Patient.destroy({ where: { id, idUser } });

module.exports = {
  deletePatient,
};
