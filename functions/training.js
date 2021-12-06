const { categoriasNechapi, labels } = require("../constants/utils");
const { getNechapiFeature } = require("../functions/tests");
const { Feature, Sequelize } = require("../models");
const flaskApiUrl = "http://67.205.147.30:5000";
const testApiUrl = process.env.TESTS_API;
const moment = require("moment");
const axios = require("axios");

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
    (parseFloat((puntuacion / total).toFixed(2)) * 100).toFixed(4)
  );
};

const getAllNechapis = () => {
  return axios.get(`${testApiUrl}/surveys`).then((res) => {
    const surveys = res.data.data
      .map((survey) => {
        if (survey.questions) {
          const anger = getPuntuacionNechapi(
            "anger",
            survey.questions,
            "before"
          );
          const sensation = getPuntuacionNechapi(
            "sensation",
            survey.questions,
            "before"
          );
          const emotional = getPuntuacionNechapi(
            "emotional",
            survey.questions,
            "before"
          );
          const sociability = getPuntuacionNechapi(
            "sociability",
            survey.questions,
            "before"
          );
          const motivation = getPuntuacionNechapi(
            "motivation",
            survey.questions,
            "before"
          );
          survey.questions.forEach((question) => {
            delete question.after;
            question.before = parseInt(question.before);
            question.idPatient = survey.idPatient;
          });
          return {
            idPatient: survey.idPatient,
            anger,
            sensation,
            emotional,
            sociability,
            motivation,
          };
        }
        return null;
      })
      .filter((survey) => survey !== null);
    return surveys;
  });
};

const printNechapisExcel = (surveys) => {
  const workbook = XLSX.utils.book_new();
  const finalWorksheet = XLSX.utils.json_to_sheet(surveys);
  XLSX.utils.book_append_sheet(workbook, finalWorksheet, "Surveys");
  const fileName = "Nechapis";
  XLSX.writeFile(workbook, `${__dirname}/${fileName}.xlsx`);
};

const getAllResults = async (idTestType) => {
  return axios.get(`${testApiUrl}/results`).then((res) => {
    return res.data.data.filter(
      (test) => test.settings.idTestType === idTestType
    );
  });
};

const getAtencionSimple = () =>
  new Promise((resolve, reject) => {
    getAllResults(1).then((tests) => {
      let targetsSimple = [];
      tests.forEach((test) => {
        const target = test.settings.target;
        test.targets.forEach((current, index) => {
          if (current.clicked) {
            const diff = moment(current.clicked).diff(
              moment(current.timestamp),
              "milliseconds"
            );
            targetsSimple.push({
              index,
              reaccion: diff,
              correct: current.target === target,
              idPatient: test.idPatient,
            });
          }
        });
      });
      resolve(targetsSimple);
    });
  });

const getAtencionCondicional = () =>
  new Promise((resolve, reject) => {
    getAllResults(2).then((tests) => {
      let targetsCondicional = [];
      tests.forEach((test) => {
        const target = test.settings.target;
        const key = test.settings.clave;
        test.targets.forEach((current, index) => {
          if (current.clicked) {
            const diff = moment(current.clicked).diff(
              moment(current.timestamp),
              "milliseconds"
            );
            const prevTarget = test.targets[index - 1];
            targetsCondicional.push({
              idPatient: test.idPatient,
              index,
              reaccion: diff,
              correct:
                index > 0
                  ? prevTarget.target === key && current.target === target
                  : false,
            });
          }
        });
      });
      resolve(targetsCondicional);
    });
  });

const getHanoi = () =>
  new Promise((resolve, reject) => {
    getAllResults(4).then((tests) => {
      let testHanoi = [];
      tests.forEach((test) => {
        test.movements.forEach((move, index) => {
          if (
            moment(
              move.timestamp_destino,
              "YYYY-MM-DD HH:mm:ss:SSS"
            ).isValid() &&
            moment(move.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS").isValid()
          ) {
            const diff = moment(
              move.timestamp_destino,
              "YYYY-MM-DD HH:mm:ss:SSS"
            ).diff(
              moment(move.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS"),
              "milliseconds"
            );
            let error = false;
            if (move.sizeOrigen < move.sizeDestino) {
              error = 3;
            }
            if (move.origen === move.destino) {
              error = 2;
            }
            if (move.sizeOrigen === null && move.sizeDestino === null) {
              error = 1;
            }
            testHanoi.push({
              idPatient: test.idPatient,
              reaccion: diff,
              index,
              error,
            });
          }
        });
      });
      resolve(testHanoi);
    });
  });

const getFlanker = () =>
  new Promise((resolve, reject) => {
    getAllResults(5).then((tests) => {
      let testFlanker = [];
      tests.forEach((test) => {
        test.estimulos.forEach((estimulo, index) => {
          const left = test.settings.leftKey;
          const right = test.settings.rightKey;
          if (
            estimulo.clicked &&
            estimulo.clicked !== null &&
            estimulo.clicked !== ""
          ) {
            const diff = moment(
              estimulo.clicked,
              "YYYY-MM-DD HH:mm:ss:SSS"
            ).diff(
              moment(estimulo.emitted, "YYYY-MM-DD HH:mm:ss:SSS"),
              "milliseconds"
            );
            const char = String(estimulo.char).toUpperCase();
            testFlanker.push({
              index,
              reaccion: diff,
              idPatient: test.idPatient,
              correct:
                estimulo.direction === "left" ? char === left : char === right,
            });
          }
        });
      });
      resolve(testFlanker);
    });
  });

const getAllEstimulos = async (idPatient) => {
  let promises = [];
  let simple = [];
  let condicional = [];
  let hanoi = [];
  let flanker = [];
  promises.push(
    new Promise((resolve, reject) => {
      getAtencionSimple().then((estimulos) => {
        simple = estimulos;
        resolve();
      });
    })
  );
  promises.push(
    new Promise((resolve, reject) => {
      getAtencionCondicional().then((estimulos) => {
        condicional = estimulos;
        resolve();
      });
    })
  );
  promises.push(
    new Promise((resolve, reject) => {
      getHanoi().then((movimientos) => {
        hanoi = movimientos;
        resolve();
      });
    })
  );
  promises.push(
    new Promise((resolve, reject) => {
      getFlanker().then((estimulos) => {
        flanker = estimulos;
        resolve();
      });
    })
  );

  await Promise.all(promises);
  let estimulosFinales = [];
  if (idPatient) {
    simple = simple.filter(
      (estimulo) => parseInt(estimulo.idPatient) === parseInt(idPatient)
    );
    condicional = condicional.filter(
      (estimulo) => parseInt(estimulo.idPatient) === parseInt(idPatient)
    );
    hanoi = hanoi.filter(
      (estimulo) => parseInt(estimulo.idPatient) === parseInt(idPatient)
    );
    flanker = flanker.filter(
      (estimulo) => parseInt(estimulo.idPatient) === parseInt(idPatient)
    );
  }
  simple.forEach((estimulo) => {
    estimulosFinales.push(estimulo);
  });
  condicional.forEach((estimulo) => {
    estimulosFinales.push(estimulo);
  });
  hanoi.forEach((estimulo) => {
    estimulosFinales.push(estimulo);
  });
  flanker.forEach((estimulo) => {
    estimulosFinales.push(estimulo);
  });
  estimulosFinales.forEach((estimulo) => {
    if (estimulo.error === undefined) {
      estimulo.error = estimulo.correct ? 0 : 1;
    }
  });
  return estimulosFinales;
};

const prepararDatos = async (idPatient) => {
  let datos = await getAllEstimulos(idPatient);
  datos.forEach((dato) => {
    if (dato.error === false) {
      dato.error = 0;
    }
    dato.correct = dato.correct ? 1 : 0;
  });
  return datos;
};

const getFeatures = async () => {
  let features = await Feature.findAll({
    order: [Sequelize.col("feature_number"), Sequelize.col("createdAt")],
  });
  features = features.map((feature) => feature.toJSON());
  let result = {};
  const numbers = [1, 2, 3, 4, 5];
  const labels = [
    "anger",
    "sensation",
    "emotional",
    "sociability",
    "motivation",
  ];
  numbers.forEach((number) => {
    const current = features.find(
      (feature) => feature.feature_number === number
    );
    const weights = [
      parseFloat(current.w0),
      parseFloat(current.w1),
      parseFloat(current.w2),
      parseFloat(current.w3),
      parseFloat(current.w4),
      parseFloat(current.b),
    ];
    result[labels[number - 1]] = { weights };
  });
  return result;
};

const getNechapiPrediction = (estimulos, features) => {
  const anger = getNechapiFeature(features.anger, estimulos);
  const sensation = getNechapiFeature(features.sensation, estimulos);
  const emotional = getNechapiFeature(features.emotional, estimulos);
  const sociability = getNechapiFeature(features.sociability, estimulos);
  const motivation = getNechapiFeature(features.motivation, estimulos);
  return { anger, sensation, emotional, sociability, motivation };
};

const limpiarEstimulos = (estimulos) => {
  estimulos = estimulos.filter((estimulo) => {
    Object.keys(estimulo).forEach((key) => {
      if (isNaN(estimulo[key])) {
        return false;
      }
    });
    return true;
  });
  return estimulos;
};

const limpiarNechapis = (nechapis) => {
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
  return nechapis;
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

const getNechapiDominante = (nechapi) => {
  let tuple = Object.keys(nechapi)
    .filter((key) => key !== "idPatient")
    .map((key) => ({ key, value: nechapi[key] }));
  tuple = tuple.sort((a, b) => (a.value > b.value ? -1 : 1));
  const key = tuple[0].key;
  const index = labels.indexOf(key);
  return index;
};

const computeWeights = async (estimulos) => {
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
        calculateWeights(body).then((response) => {
          let { weights } = response.data;
          console.log(weights);
          features[label] = {};
          features[label].weights = weights;
          resolve();
        });
      })
    );
  });
  await Promise.all(promises);
  return features;
};

const calculateWeights = (body) => {
  return axios.post(`${flaskApiUrl}/linear`, body);
};

const calculateFeatures = async (method) => {
  let nechapis = await getAllNechapis();
  let estimulos = await prepararDatos();
  estimulos = limpiarEstimulos(estimulos);
  nechapis = limpiarNechapis(nechapis);
  estimulos = combinarEstimulosNechapis(estimulos, nechapis);
  estimulos = limpiarEstimulos(estimulos);
  estimulos = await agregarCluster(estimulos, method);
  estimulos = separarDatos(estimulos);
  console.log(estimulos);
  const features = await computeWeights(estimulos);
  console.log(features);
  return features;
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

const agregarCluster = async (estimulos, method) => {
  if (method === "kmeans") {
    estimulos = await agregarKmeans(estimulos);
  } else if (method === "bayes") {
    estimulos = await agregarBayes(estimulos);
  } else {
    estimulos = await agregarKnn(estimulos);
  }
  return estimulos;
};

const agregarKmeans = async (datos) => {
  const separados = separarDatos(datos);
  const response = await axios
    .post(`${flaskApiUrl}/kmeans`, {
      ...separados,
    })
    .catch((error) => {
      //console.log(error.response);
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

const agregarBayes = async (datos) => {
  const separados = separarDatos(datos);
  const response = await axios.post(`${flaskApiUrl}/bayes`, {
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

const agregarKnn = async (datos) => {
  const separados = separarDatos(datos);
  const response = await axios.post(`${flaskApiUrl}/knn`, {
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

module.exports = {
  getKmeans,
  getFeatures,
  computeWeights,
  getAllEstimulos,
  limpiarNechapis,
  limpiarEstimulos,
  calculateWeights,
  calculateFeatures,
  getNechapiDominante,
  getNechapiPrediction,
  combinarEstimulosNechapis,
};
