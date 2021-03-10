const models = require('../../models');

const { Test, AccessUrl, TestType, Patient } = models;

const getTestByQuery = async (query) => Test.findAll({
    where: query,
    include: [{
        model: AccessUrl,
        as: 'accessUrl',
    },
    {
        model: TestType,
        as: "testType",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]

});

const getById = async (query) => Test.findOne({
    where: query,
    include: [{
        model: AccessUrl,
        as: 'accessUrl',
    },
    {
        model: TestType,
        as: "testType",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]

});

const getUserTests = async (idUser) => {
    const results = await getTestByQuery({ idUser });
    return results
}

const getUserTest = async (id) => {
    const results = await getById({ id });
    return results
}

module.exports = {
    getTestByQuery,
    getUserTests,
    getUserTest,
};
