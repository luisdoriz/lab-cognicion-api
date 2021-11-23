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

const features = {
  anger: {
    average: 33.6387,
    dev: 9.8626,
    weights: [
      0.00142824, 0.00005922, -4.47620855, -2.16373442, 0.23588583, 37.46984216,
    ],
  },
  sensation: {
    average: 71.3823,
    dev: 14.9586,
    weights: [
      0.00970492, 0.00121218, -2.90708073, 0.54886367, -0.57721933, 72.44405135,
    ],
  },
  emotional: {
    average: 60.4118,
    dev: 15.8384,
    weights: [
      -0.00002479, -0.00050846, -8.49174107, -4.43767491, -0.0184151,
      67.53824207,
    ],
  },
  sociability: {
    average: 65.4412,
    dev: 16.4854,
    weights: [
      0.00369191, -0.00136071, 0.90040811, 2.26404486, 1.02968978, 62.52954642,
    ],
  },
  motivation: {
    average: 50.3529,
    dev: 17.4892,
    weights: [
      -0.00293698, 0.00061018, -10.54274205, -5.66083633, -0.20580375,
      58.74841384,
    ],
  },
};

const categoriasNechapi = {
  anger: [5, 7, 8, 10, 13, 17, 18, 19, 25, 26, 31, 35],
  sensation: [1, 2, 20, 27, 28, 36, 37, 38, 40],
  emotional: [3, 4, 6, 11, 12, 24, 32, 33, 34],
  sociability: [14, 15, 16, 27],
  motivation: [21, 22, 23, 29, 30, 39],
};

const getPuntuacionNechapi = (categoria, respuestas, tiempo) => {
  let total = 0;
  let puntuacion = 0;
  categoriasNechapi[categoria].forEach((numero) => {
    let respuesta = respuestas.find(
      (resp) => parseInt(resp.index) === parseInt(numero)
    );
    total += 5;
    if (respuesta) {
      puntuacion += parseInt(respuesta[tiempo]);
    }
  });
  return parseFloat(
    (parseFloat((puntuacion / total).toFixed(6)) * 100).toFixed(4)
  );
};

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
  try {
    const tests = await getTestByQuery(query);
    res.status(200).json({ data: tests });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({ status: responses.INTERNAL_ERROR, error });
  }
};

const getNechapiFeature = (feature, estimulos) => {
  const weights = feature.weights;
  let total = [];
  estimulos.forEach((estimulo) => {
    let result =
      estimulo.index * weights[0] +
      estimulo.reaccion * weights[1] +
      estimulo.correct * weights[2] +
      estimulo.error * weights[3] +
      estimulo.grupo * weights[4] +
      weights[5];
    total.push(result);
  });

  let result = 0.0;
  total.forEach((value) => {
    if (!isNaN(value)) {
      result = parseFloat(result) + parseFloat(value);
    }
  });
  let average = result / total.length;
  return {
    result: parseFloat(average.toFixed(4)),
    average: feature.average,
    dev: feature.dev,
  };
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
    const results = await printExcel(idPatient);
    results.forEach((result) => {
      result.grupo = Math.ceil(Math.random() * 5);
    });
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
