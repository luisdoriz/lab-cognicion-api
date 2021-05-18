const { Op } = require('sequelize');
const models = require('../../models');

const { Test, AccessUrl, TestType, Patient, User } = models;

const getTestByQuery = async (query) => {
    if ('date' in query) {
        if ('endDate' in query) {
            endDate = new Date(query.endDate)
            delete query.endDate
        } else {
            endDate = new Date()
        }
        start_date = new Date(query.date)
        delete query.date
        query.createdAt = {
            [Op.between]: [start_date, endDate]
        }
    }
    query = {
        where: query,
        order: [
            ['id', 'DESC'],
        ],    
    };
    query.include = [{
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
    return Test.findAll(query)
}

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

const getByAccessUrlId = async (id) => Test.findOne({
    include: [{
        model: AccessUrl,
        as: 'accessUrl',
        where: {
            id
        }
    },
    {
        model: TestType,
        as: "testType",
    },
    {
        model: User,
        as: "user",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]

});

module.exports = {
    getTestByQuery,
    getUserTests,
    getUserTest,
    getByAccessUrlId,
};
