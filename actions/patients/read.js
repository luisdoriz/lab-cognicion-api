const models = require('../../models');

const { Patient } = models;

const findPatientsByQuery = async (query) => Patient.findAll({
    where: query,
});

const findPatientByQuery = async (query) => Patient.findOne({
    where: query,
});

module.exports = {
    findPatientByQuery,
    findPatientsByQuery,
};