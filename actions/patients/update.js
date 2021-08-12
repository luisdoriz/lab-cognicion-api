const models = require("../../models");

const { Patient, Damage } = models;

const updatePatient = async (ids, body) => {
  const { damages } = body;
  const patient = await Patient.update(body, { where: ids });
  const promises = [];
  damages.forEach(({ id, damageLocation }) => {
    if (isNaN(id)) {
      if (String(id).includes("d")) {
        promises.push(
          Damage.destroy({ where: { id: String(id).split("d")[1] } })
        );
      } else {
        promises.push(Damage.create({ damageLocation, idUser: ids.idUser }));
      }
    } else {
      promises.push(Damage.update({ damageLocation }, { where: { id } }));
    }
  });
  await Promise.all(promises);
  return patient;
};

module.exports = {
  updatePatient,
};
