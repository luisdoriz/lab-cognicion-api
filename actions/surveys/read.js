const { Op } = require('sequelize');
const models = require('../../models');

const { Survey, AccessUrl, SurveyType, Patient } = models;

const getSurveyByQuery = async (query) => {
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
        model: SurveyType,
        as: "surveyType",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]
    return Survey.findAll(query)
}

const getById = async (query) => Survey.findOne({
    where: query,
    include: [{
        model: AccessUrl,
        as: 'accessUrl',
    },
    {
        model: SurveyType,
        as: "surveyType",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]

});

const getUserSurveys = async (idUser) => {
    const results = await getSurveyByQuery({ idUser });
    return results
}

const getUserSurvey = async (id) => {
    const results = await getById({ id });
    return results
}

const getByAccessUrlId = async (id) => Survey.findOne({
    include: [{
        model: AccessUrl,
        as: 'accessUrl',
        where: {
            id
        }
    },
    {
        model: SurveyType,
        as: "surveyType",
    },
    {
        model: Patient,
        as: "patient",
    },
    ]

});

module.exports = {
    getSurveyByQuery,
    getUserSurveys,
    getUserSurvey,
    getByAccessUrlId,
    getById,
};
