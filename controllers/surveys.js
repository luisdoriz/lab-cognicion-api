const axios = require("axios");
const responses = require("../constants/responses");
const {
  createSurvey,
  getByAccessUrlId,
  getUserSurveys,
  getSurveyByQuery,
  getUserSurvey,
} = require("../actions/surveys");

exports.postSurvey = async (req, res) => {
  const { body } = req;
  try {
    const new_body = body;
    new_body.idUser = new_body.user.id;
    delete new_body.user;
    const user_test = await createSurvey(new_body);
    res.status(200).json({ data: user_test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postSurveyAnswer = async (req, res) => {
  const { body } = req;
  try {
    const testApiUrl = process.env.TESTS_API;
    const new_body = body;

    const survey = await getByAccessUrlId(body.idAccessUrl);
    new_body.idUser = survey.idUser;
    new_body.idPatient = survey.idPatient;
    new_body.idSurvey = survey.id;
    delete new_body.idAccessUrl;
    const request = await axios.post(`${testApiUrl}/surveys`, new_body);
    res.status(200).json(request.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getSurveys = async (req, res) => {
  const { query, body } = req;
  const { id: idUser, isAdmin } = body.user;
  const { admin = false } = query;
  try {
    let surveys = {};
    if (!isAdmin || !admin) {
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
  const { id: idUser, isAdmin } = body.user;
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
  const { id: idUser, isAdmin } = body.user;
  const { id: idSurvey } = params;
  const { admin = false } = query;

  try {
    const survey = await getUserSurvey(idSurvey);
    const testApiUrl = process.env.TESTS_API;
    const query = {
      idSurvey: parseInt(idSurvey),
    };
    if (!isAdmin || !admin) {
      query.idUser = idUser;
    }
    const request = await axios.get(`${testApiUrl}/surveys`, { params: query });
    let { data } = request.data;
    if (data.length > 0) {
      data = data[0];
      res.status(200).json({
        status: responses.SUCCESS_STATUS,
        data: { survey, results: data },
      });
    } else {
      res
        .status(200)
        .json({ status: responses.SUCCESS_STATUS, data: { survey } });
    }
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};
