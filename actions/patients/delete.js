const models = require("../../models");

const { Patient } = models;

const deletePatient = async (id) => {
  Patient.update({ deletedAt: new Date() }, { where: { id } });
};

module.exports = {
  deletePatient,
};
