const responses = require("../constants/responses");
const {
  createSurvey,
  getUserSurvey,
  getUserSurveys,
  getSurveyByQuery,
  getByAccessUrlId,
} = require("../actions/surveys");
const { Survey } = require("../mongoose");
const { SurveyType } = require("../models");

exports.getSurveyTypes = async (req, res) => {
  try {
    const surveyTypes = await SurveyType.findAll();
    res.status(200).send({ surveyTypes });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postSurvey = async (req, res) => {
  try {
    const { body } = req;
    const new_body = body;
    new_body.idUser = req.idUser;
    const user_test = await createSurvey(new_body);
    res.status(200).json({ data: user_test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postSurveyAnswer = async (req, res) => {
  try {
    const { body } = req;
    const new_body = body;
    const { idAccessUrl } = req;
    let survey = await getByAccessUrlId(idAccessUrl);
    new_body.idUser = survey.idUser;
    new_body.idPatient = survey.idPatient;
    new_body.idSurvey = survey.id;
    delete new_body.idAccessUrl;
    survey = await Survey.create({ ...new_body });
    res.status(200).json({ survey });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getSurveys = async (req, res) => {
  try {
    const { idUser, user } = req;
    let surveys = {};
    if (!user.idUserType < 2) {
      surveys = await getUserSurveys(idUser);
    } else {
      surveys = await getUserSurveys();
    }
    res.status(200).json({ data: surveys });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.searchSurveys = async (req, res) => {
  const { query, body } = req;
  const { id: idUser, isAdmin } = req.user;
  const { admin = false } = query;
  query.admin = admin;
  if (!isAdmin || !admin) {
    query.idUser = idUser;
  }
  if (isNaN(query.idPatient) || query.idPatient === "") {
    delete query.idPatient;
  }
  delete query.admin;
  if (isNaN(query.type)) {
    delete query.type;
  }
  if (query.startDate === "") {
    delete query.startDate;
  }
  if (query.endDate === "") {
    delete query.endDate;
  }
  try {
    const tests = await getSurveyByQuery(query);
    res.status(200).json({ data: tests });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getSurvey = async (req, res) => {
  const { params, body, query } = req;
  let idUser;
  let isAdmin;
  if (req.user) {
    idUser = req.user.id;
    isAdmin = req.user.isAdmin;
  } else {
    idUser = body.idUser;
    isAdmin = false;
  }
  const { id: idSurvey } = params;
  const { admin = false } = query;
  try {
    const survey = await getUserSurvey(idSurvey);
    const query = {
      idSurvey: parseInt(idSurvey),
    };
    if (!isAdmin || !admin) {
      query.idUser = idUser;
    }
    const results = await Survey.findOne(query);
    res.status(200).json({
      status: responses.SUCCESS_STATUS,
      data: { survey, results },
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};
