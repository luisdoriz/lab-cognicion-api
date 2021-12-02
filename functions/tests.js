const axios = require("axios");
const { categoriasNechapi } = require("../constants/utils");
const testApiUrl = process.env.TESTS_API;

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
    (parseFloat((puntuacion / total).toFixed(6)) * 100).toFixed(3)
  );
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
    result: parseFloat(average.toFixed(3)),
    average: feature.average,
    dev: feature.dev,
  };
};

module.exports = {
  getPuntuacionNechapi,
  getNechapiFeature,
};
