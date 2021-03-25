const models = require('../../models');

const { Patient } = models;

const findPatientByQuery = async (query) => Patient.findAll({
    where: query,
});

module.exports = {
    findPatientByQuery,
};