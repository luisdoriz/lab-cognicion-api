const models = require("../../models");

const { Patient, Damage } = models;

const createPatient = async (body) => {
  const { damages } = body;
  const patient = await Patient.create({ ...body });
  damages.forEach(({ damageLocation }) => {
    Damage.create({
      damageLocation,
      idPatient: patient.id,
    });
  });
  return patient;
};

module.exports = {
  createPatient,
};
