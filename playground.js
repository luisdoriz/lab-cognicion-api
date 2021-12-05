const { default: axios } = require("axios");
const testApiUrl = "https://lab-cognicion-tests-api.herokuapp.com/";
const moment = require("moment");
const XLSX = require("xlsx");

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

const printExcel = async (idPatient) => {
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

const getAllEstimulos = async () => {
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

module.exports = { printExcel, getAllNechapis, getAllEstimulos };
