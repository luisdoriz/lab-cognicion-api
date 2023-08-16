const models = require("../models");
const { Patient, Damage } = models;

const pacienteExiste = async (idUser, email) => {
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

const createPatient = async (body) => {
  const { damages } = body;
  const patient = await Patient.create({ ...body });
  if (damages) {
    damages.forEach(({ damageLocation }) => {
      Damage.create({
        damageLocation,
        idPatient: patient.id,
      });
    });
  }
  return patient;
};

const updatePatient = async (ids, body) => {
  const { damages } = body;
  const patient = await Patient.update(body, { where: ids });
  const promises = [];
  if (Array.isArray(damages)) {
    damages.forEach(({ id, damageLocation }) => {
      if (isNaN(id)) {
        if (String(id).includes("d")) {
          promises.push(
            Damage.destroy({ where: { id: String(id).split("d")[1] } })
          );
        } else {
          promises.push(Damage.create({ damageLocation, idPatient: ids.id }));
        }
      } else {
        promises.push(Damage.update({ damageLocation }, { where: { id } }));
      }
    });
  }
  await Promise.all(promises);
  return patient;
};

const deletePatient = async (id) => {
  Patient.update({ deletedAt: new Date() }, { where: { id } });
};

module.exports = {
  createPatient,
  deletePatient,
  updatePatient,
  pacienteExiste,
  findPatientByQuery,
  findPatientsByQuery,
};
