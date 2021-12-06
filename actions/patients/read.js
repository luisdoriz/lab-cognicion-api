const models = require("../../models");

const { Patient, Damage } = models;

const pacienteExiste = (idUser, email) => {
  const patient = await Patient.findOne({
    where: {
      idUser,
      email,
    },
  });
  return patient;
};

const findPatientsByQuery = async (query) =>
  Patient.findAll({
    where: { ...query, deletedAt: null },
    order: [["id", "DESC"]],
  });

const findPatientByQuery = async (query) =>
  Patient.findOne({
    where: { ...query, deletedAt: null },
    include: [{ model: Damage, as: "damages" }],
  });

module.exports = {
  findPatientByQuery,
  findPatientsByQuery,
  pacienteExiste,
};
