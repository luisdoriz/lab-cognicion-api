const axios = require("axios");
const { findPatientByQuery } = require("../actions/patients/read");
const { createTest } = require("../actions/tests/create");
const {
  getUserTests,
  getUserTest,
  getTestByQuery,
  getByAccessUrlId,
} = require("../actions/tests/read");
const responses = require("../constants/responses");
const { printExcel } = require("../playground");
const {
  getPuntuacionNechapi,
  getNechapiFeature,
} = require("../functions/tests");
const { getFeatures } = require("../functions/training");
const { prepararDatos, agregarKmeans } = require("./training");

exports.createTest = async (req, res) => {
  const { body } = req;
  try {
    const testApiUrl = process.env.TESTS_API;
    const new_body = body;
    new_body.idUser = new_body.user.id;
    delete new_body.user;
    const user_test = await createTest(new_body);
    new_body.idTest = user_test.id;
    await axios.post(`${testApiUrl}/settings`, new_body);
    await findPatientByQuery({ id: new_body.idPatient });
    res.status(200).json({ data: user_test });
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postResult = async (req, res) => {
  const { body } = req;
  try {
    const testApiUrl = process.env.TESTS_API;
    const test = await getByAccessUrlId(body.idAccessUrl);
    const new_body = body;
    new_body.idUser = test.user.id;
    new_body.idTest = test.id;
    new_body.idPatient = test.patient.id;
    delete new_body.idAccessUrl;
    delete new_body.token;
    const request = await axios.post(`${testApiUrl}/results`, new_body);
    res.status(200).json(request.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.putResult = async (req, res) => {
  const { body } = req;
  try {
    const testApiUrl = process.env.TESTS_API;
    const new_body = body;
    const rule = new_body.rule;
    const request = await axios.put(
      `${testApiUrl}/results/${new_body.idTest}`,
      { rule }
    );
    res.status(200).json(request.data);
  } catch (error) {
    console.log("Error: ", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getResults = async (req, res) => {
  const { body, query } = req;
  const { id: idUser, isAdmin } = body.user;
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
  const { id: idUser, isAdmin } = body.user;
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
  if (query.date === "") {
    delete query.date;
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
  const { params } = req;
  const { idPatient } = params;
  try {
    const testApiUrl = process.env.TESTS_API;
    const request = await axios.get(`${testApiUrl}/surveys`, {
      params: {
        idPatient: idPatient,
      },
    });
    const survey = request.data.data;
    let results = await prepararDatos(idPatient);
    //Varia dependiendo del metodo
    results = await agregarKmeans(results);
    const features = await getFeatures();
    const anger = getNechapiFeature(features.anger, results);
    const sensation = getNechapiFeature(features.sensation, results);
    const emotional = getNechapiFeature(features.emotional, results);
    const sociability = getNechapiFeature(features.sociability, results);
    const motivation = getNechapiFeature(features.motivation, results);
    if (survey.length > 0) {
      const current = survey[0];
      anger.real = getPuntuacionNechapi("anger", current.questions, "before");
      sensation.real = getPuntuacionNechapi(
        "sensation",
        current.questions,
        "before"
      );
      emotional.real = getPuntuacionNechapi(
        "emotional",
        current.questions,
        "before"
      );
      sociability.real = getPuntuacionNechapi(
        "sociability",
        current.questions,
        "before"
      );
      motivation.real = getPuntuacionNechapi(
        "motivation",
        current.questions,
        "before"
      );
    } else {
      anger.real = 0;
      sensation.real = 0;
      emotional.real = 0;
      sociability.real = 0;
      motivation.real = 0;
    }
    res.status(200).json({
      data: { anger, sensation, emotional, sociability, motivation },
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getResult = async (req, res) => {
  const { params, body } = req;
  const { id: idTest } = params;
  try {
    const test = await getUserTest(idTest);
    const testApiUrl = process.env.TESTS_API;
    url = `${testApiUrl}/results?idTest=${idTest}`;
    const request = await axios.get(url);
    const settings = await axios.get(`${testApiUrl}/settings`, {
      params: { idTest },
    });
    const { data } = request.data;
    let results = {};
    if (data.length > 0) {
      results = data[0];
    }
    res
      .status(200)
      .json({ data: { test, results, settings: settings.data.data[0] } });
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
