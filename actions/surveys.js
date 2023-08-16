const { Op } = require("sequelize");
const models = require("../models");
const { createAccessUrl } = require("./accessUrls");
const { Survey, AccessUrl, SurveyType, Patient } = models;

const getSurveyByQuery = async (query) => {
  if ("startDate" in query) {
    if ("endDate" in query) {
      endDate = new Date(query.endDate);
      delete query.endDate;
    } else {
      endDate = new Date();
    }
    start_date = new Date(query.startDate);
    delete query.startDate;
    query.createdAt = {
      [Op.between]: [start_date, endDate],
    };
  }
  query = {
    where: query,
    order: [["id", "DESC"]],
  };
  query.include = [
    {
      model: AccessUrl,
      as: "accessUrl",
    },
    {
      model: SurveyType,
      as: "surveyType",
    },
    {
      model: Patient,
      as: "patient",
      where: {
        deletedAt: null,
      },
    },
  ];
  return Survey.findAll(query);
};

const getSurveyById = async (query) =>
  Survey.findOne({
    where: query,
    include: [
      {
        model: AccessUrl,
        as: "accessUrl",
      },
      {
        model: SurveyType,
        as: "surveyType",
      },
      {
        model: Patient,
        as: "patient",
      },
    ],
  });

const getUserSurveys = async (idUser = false) => {
  if (idUser) {
    const results = await getSurveyByQuery({ idUser });
    return results;
  }
  const results = await getSurveyByQuery({});
  return results;
};

const getUserSurvey = async (id) => {
  const results = await getById({ id });
  return results;
};

const getByAccessUrlId = async (id) =>
  Survey.findOne({
    include: [
      {
        model: AccessUrl,
        as: "accessUrl",
        where: {
          id,
        },
      },
      {
        model: SurveyType,
        as: "surveyType",
      },
      {
        model: Patient,
        as: "patient",
      },
    ],
  });

const postSurvey = async (body) => Survey.create(body);

const createSurvey = async (body) => {
  try {
    const accessUrl = await createAccessUrl();
    let idAccessUrl = accessUrl.id;
    const { idUser, idPatient, idSurveyType: type, idMultiTest } = body;
    const surveyBody = {
      type,
      idUser,
      idPatient,
      idAccessUrl,
      idMultiTest,
    };
    test = await postSurvey(surveyBody);
    return test;
  } catch (err) {
    console.log("error", err);
    return null;
  }
};

const updateSurvey = async (data) => {
  await Survey.update(data, {
    where: {
      id: data.id,
    },
  });
  return getSurveyById(data.id);
};

module.exports = {
  getByAccessUrlId,
  getSurveyByQuery,
  getUserSurveys,
  getUserSurvey,
  createSurvey,
  getSurveyById,
  updateSurvey,
};
