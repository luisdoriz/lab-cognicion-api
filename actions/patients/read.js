const models = require("../../models");

const { Patient, Damage } = models;

const findPatientsByQuery = async (query) =>
  Patient.findAll({
    where: query,
    order: [["id", "DESC"]],
  });

const findPatientByQuery = async (query) =>
  Patient.findOne({
    where: query,
    include: [{ model: Damage, as: "damages" }],
  });

module.exports = {
  findPatientByQuery,
  findPatientsByQuery,
};
