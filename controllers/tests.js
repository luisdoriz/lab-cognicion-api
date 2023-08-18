const axios = require("axios");
const moment = require("moment");
const { findPatientByQuery } = require("../actions/patients");
const {
  createTest,
  getUserTest,
  getUserTests,
  getTestByQuery,
  getByAccessUrlId,
  updateTest,
} = require("../actions/tests");
const responses = require("../constants/responses");
const { labels } = require("../constants/utils");
const {
  getPuntuacionNechapi,
  getNechapiFeature,
  formatSingleTestResults,
} = require("../functions/tests");
const {
  getFeatures,
  prepararDatos,
  agregarCluster,
  combinarEstimulosNechapis,
  limpiarEstimulos,
  formatNechapi,
  getStatsNechapis,
} = require("../functions/training");
const { Result, Setting, Survey } = require("../mongoose");

exports.createTest = async (req, res) => {
  try {
    const { body } = req;
    const new_body = body;
    const { idUser } = req;
    delete new_body.user;
    new_body.idUser = idUser;
    const user_test = await createTest(new_body);
    new_body.idTest = user_test.id;
    delete new_body.testType;
    delete new_body._id;
    await Setting.create({ ...new_body });
    await findPatientByQuery({ id: new_body.idPatient });
    res.status(200).json({ data: user_test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postResult = async (req, res) => {
  try {
    const { body, idAccessUrl } = req;
    const test = await getByAccessUrlId(idAccessUrl);
    if (test === null) {
      return res
        .status(400)
        .send({ message: "Test not found: invalid test id." });
    }
    const new_body = body;
    new_body.idUser = test.user.id;
    new_body.idTest = test.id;
    new_body.idPatient = test.patient.id;
    delete new_body.idAccessUrl;
    delete new_body.token;
    const result = await Result.create({ ...new_body });
    const settings = await Setting.findOne({ idTest: test.id });
    const formattedTest = formatSingleTestResults(
      new_body,
      settings,
      test.type
    );
    await Result.updateOne({ idTest: test.id }, { ...formattedTest });
    const completedAt = moment().format("YYYY-MM-DD HH:mm");
    await updateTest({
      ...test,
      completedAt,
    });
    res.status(200).json({ result: formattedTest });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.putResult = async (req, res) => {
  try {
    const { rule, idTest } = req.body;
    const result = await Result.updateOne(
      {
        idTest,
      },
      {
        rule,
      }
    );
    res.status(200).json({ result });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getResults = async (req, res) => {
  const { body, query } = req;
  const { id: idUser, isAdmin } = req.user;
  const { admin = false } = query;
  try {
    let tests = [];
    if (!isAdmin || !admin) {
      tests = await getUserTests(idUser);
    } else {
      tests = await getUserTests();
    }
    res.status(200).json({ data: tests });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.searchTests = async (req, res) => {
  const { query, body } = req;
  const { id: idUser, isAdmin } = req.user;
  const { admin = false } = query;
  query.admin = admin;
  if (!isAdmin || !admin) {
    query.idUser = idUser;
  }
  delete query.admin;
  if (isNaN(query.idPatient)) {
    delete query.idPatient;
  }
  if (isNaN(query.type)) {
    delete query.type;
  }
  if (query.startDate !== null && query.startDate === "") {
    delete query.startDate;
  }

  if (query.endDate !== null && query.endDate === "") {
    delete query.endDate;
  }
  try {
    const tests = await getTestByQuery(query);
    res.status(200).json({ data: tests });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getAllPatientResults = async (req, res) => {
  const { params, query } = req;
  const { idPatient } = params;
  const { method } = query;
  try {
    const surveys = await Survey.find({ idPatient });
    const prediction = {};
    labels.forEach((key) => {
      prediction[key] = {};
    });
    if (surveys.length > 0) {
      const current = surveys[0];
      prediction.anger.real = getPuntuacionNechapi(
        "anger",
        current.questions,
        "before"
      );
      prediction.sensation.real = getPuntuacionNechapi(
        "sensation",
        current.questions,
        "before"
      );
      prediction.emotional.real = getPuntuacionNechapi(
        "emotional",
        current.questions,
        "before"
      );
      prediction.sociability.real = getPuntuacionNechapi(
        "sociability",
        current.questions,
        "before"
      );
      prediction.motivation.real = getPuntuacionNechapi(
        "motivation",
        current.questions,
        "before"
      );
    } else {
      prediction.anger.real = 0;
      prediction.sensation.real = 0;
      prediction.emotional.real = 0;
      prediction.sociability.real = 0;
      prediction.motivation.real = 0;
    }
    surveys = surveys.map((survey) => formatNechapi(survey));
    let results = await prepararDatos(idPatient);
    if (surveys.length > 0) {
      results = combinarEstimulosNechapis(results, surveys);
      results = limpiarEstimulos(results);
    }
    results = await agregarCluster(results, method);
    const features = await getFeatures();
    const stats = await getStatsNechapis();
    prediction.anger = {
      ...prediction.anger,
      ...getNechapiFeature(features.anger, results),
      ...stats.anger,
    };
    prediction.sensation = {
      ...prediction.sensation,
      ...getNechapiFeature(features.sensation, results),
      ...stats.sensation,
    };
    prediction.emotional = {
      ...prediction.emotional,
      ...getNechapiFeature(features.emotional, results),
      ...stats.emotional,
    };
    prediction.sociability = {
      ...prediction.sociability,
      ...getNechapiFeature(features.sociability, results),
      ...stats.sociability,
    };
    prediction.motivation = {
      ...prediction.motivation,
      ...getNechapiFeature(features.motivation, results),
      ...stats.motivation,
    };
    res.status(200).json({
      data: prediction,
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getResult = async (req, res) => {
  try {
    let { idTest } = req.params;
    const test = await getUserTest(idTest);
    idTest = parseInt(idTest);
    const results = await Result.findOne({ idTest });
    const settings = await Setting.findOne({ idTest });
    res.status(200).json({ data: { test, results, settings } });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getFiabilityTest = async (req, res) => {
  try {
    const testApiUrl = process.env.TESTS_API;
    url = `${testApiUrl}/results/fiability`;
    const request = await axios.get(url);
    const { data } = request.data;
    res.status(200).json({ data });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};
