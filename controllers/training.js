const axios = require("axios");
const { getFeatures, getNechapiPrediction } = require("../functions/training");
const {
  getAllEstimulos,
  printExcel,
  getAllNechapis,
} = require("../playground");
const flaskApiUrl = process.env.FLASK_API_URL;
const { labels } = require("../constants/utils");
const models = require("../models");

const getParams = async (req, res, next) => {
  try {
    const { method } = req.query;
    if (!method) return res.sendStatus(400);
    const estimulos = await getAllEstimulos();
    const index = estimulos
      .map(({ index }) => index)
      .filter((value) => !isNaN(value));
    const reaction = estimulos
      .map(({ reaccion }) => reaccion)
      .filter((value) => !isNaN(value));
    const correct = estimulos.map(({ correct }) => (correct ? 1 : 0));
    const error = estimulos.map(({ error }) => (error === false ? 0 : error));
    const response = await axios.post(`${flaskApiUrl}/${method}`, {
      index,
      reaction,
      correct,
      error,
    });
    const params = response.data;
    res.status(200).send(params);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

const prepararDatos = async (idPatient) => {
  let datos = await printExcel(idPatient);
  datos.forEach((dato) => {
    if (dato.error === false) {
      dato.error = 0;
    }
    dato.correct = dato.correct ? 1 : 0;
  });
  return datos;
};

const separarDatos = (datos) => {
  const index = datos
    .map(({ index }) => index)
    .filter((value) => !isNaN(value));
  const reaction = datos
    .map(({ reaccion }) => reaccion)
    .filter((value) => !isNaN(value));
  const correct = datos.map(({ correct }) => (correct ? 1 : 0));
  const error = datos.map(({ error }) => (error === false ? 0 : error));
  const grupo = datos.map(({ grupo }) => grupo);
  const anger = datos.map(({ anger }) => anger);
  const sensation = datos.map(({ sensation }) => sensation);
  const emotional = datos.map(({ emotional }) => emotional);
  const sociability = datos.map(({ sociability }) => sociability);
  const motivation = datos.map(({ motivation }) => motivation);
  const dominante = datos.map(({ dominante }) => dominante);
  return {
    index,
    reaction,
    correct,
    error,
    grupo,
    anger,
    sensation,
    emotional,
    sociability,
    motivation,
    dominante,
  };
};

const separarNechapis = (datos) => {
  const anger = datos
    .map(({ anger }) => anger)
    .filter((anger) => !isNaN(anger));
  const sensation = datos
    .map(({ sensation }) => sensation)
    .filter((sensation) => !isNaN(sensation));
  const emotional = datos
    .map(({ emotional }) => emotional)
    .filter((emotional) => !isNaN(emotional));
  const sociability = datos
    .map(({ sociability }) => sociability)
    .filter((sociability) => !isNaN(sociability));
  const motivation = datos
    .map(({ motivacion }) => motivacion)
    .filter((motivacion) => !isNaN(motivacion));
  return { anger, sensation, emotional, sociability, motivation };
};

const combinarEstimulosNechapis = (estimulos, nechapis) => {
  let combinados = [];
  nechapis.forEach((nechapi) => {
    const current = estimulos.filter(
      (estimulo) => parseInt(estimulo.idPatient) === parseInt(nechapi.idPatient)
    );
    current.forEach((estimulo) => {
      combinados.push({
        ...estimulo,
        ...nechapi,
        dominante: getNechapiDominante(nechapi),
      });
    });
  });
  return combinados;
};

const agregarKmeans = async (datos) => {
  const separados = separarDatos(datos);
  const response = await axios.post(`${flaskApiUrl}/kmeans`, {
    ...separados,
  });
  let { prediction } = response.data;
  //Convertir a clusters numerados de 1 a 5
  /**
   * 1 = anger
   * 2 = sensation
   * 3 = emotional
   * 4 = sociability
   * 5 = motivation
   */
  prediction = prediction.map((value) => value + 1);
  datos.forEach((dato, index) => {
    dato.grupo = prediction[index];
  });
  return datos;
};

const getKmeans = async (req, res, next) => {
  try {
    const { idPatient } = req.params;
    let datos = await prepararDatos(idPatient);
    datos = separarDatos(datos);
    datos = await agregarKmeans(datos);
    const features = await getFeatures();
    const result = getNechapiPrediction(datos, features);
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

const getNechapiDominante = (nechapi) => {
  let tuple = Object.keys(nechapi)
    .filter((key) => key !== "idPatient")
    .map((key) => ({ key, value: nechapi[key] }));
  tuple = tuple.sort((a, b) => (a.value > b.value ? -1 : 1));
  const key = tuple[0].key;
  const index = labels.indexOf(key);
  if (index === -1) {
    console.log(nechapi);
  }
  return index;
};

const calculateFeatures = async (method) => {
  let nechapis = await getAllNechapis();
  let estimulos = await prepararDatos();
  estimulos = estimulos
    .map((estimulo) => {
      let valid = true;
      Object.keys(estimulo).forEach((key) => {
        if (isNaN(estimulo[key])) {
          valid = false;
        }
      });
      if (valid) return estimulo;
      return null;
    })
    .filter((dato) => dato !== null);
  nechapis = nechapis
    .map((dato) => {
      if (
        dato.anger === 100 &&
        dato.sensation === 100 &&
        dato.emotional === 100 &&
        dato.motivation === 100 &&
        dato.sociability === 100
      ) {
        return null;
      }
      return dato;
    })
    .filter((dato) => dato !== null);
  estimulos = combinarEstimulosNechapis(estimulos, nechapis);
  estimulos = estimulos.filter((estimulo) => {
    Object.keys(estimulo).forEach((key) => {
      if (isNaN(estimulo[key])) {
        return false;
      }
    });
    return true;
  });
  estimulos = await agregarKmeans(estimulos);
  estimulos = separarDatos(estimulos);

  const promises = [];
  const features = {};
  labels.forEach((label) => {
    promises.push(
      new Promise((resolve, reject) => {
        const target = estimulos[label];
        const body = {
          ...estimulos,
          target,
        };
        axios.post(`${flaskApiUrl}/${method}`, body).then((response) => {
          let { prediction } = response.data;
          features[label] = {};
          features[label].weights = prediction;
          resolve();
        });
      })
    );
  });
  await Promise.all(promises);
  return features;
};

const calculateParams = async (req, res, next) => {
  try {
    const { method } = req.query;
    const features = await calculateFeatures(method);
    const promises = [];
    Object.keys(features).forEach((key, index) => {
      const current = features[key];
      const { weights } = current;
      console.log(weights);
      promises.push(
        models.Feature.create({
          w0: weights[0],
          w1: weights[1],
          w2: weights[2],
          w3: weights[3],
          w4: weights[4],
          b: weights[5],
          feature: key,
          feature_number: labels.indexOf(key) + 1,
        })
      );
    });
    await Promise.all(promises);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

module.exports = {
  getParams,
  getKmeans,
  agregarKmeans,
  calculateParams,
  calculateFeatures,
  prepararDatos,
};
