const models = require("../../models");

const { Patient, Damage } = models;

const createPatient = async (body) => {
  const { damages } = body;
  delete body.idUser;
  const patient = await Patient.create({ ...body });
  damages.forEach(({ damageLocation }) => {
    Damage.create({
      damageLocation,
      idUser: patient.id,
    });
  });
  return patient;
};

module.exports = {
  createPatient,
};
