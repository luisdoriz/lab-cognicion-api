const { categoriasNechapi } = require("../constants/utils");
const { getResultsCondicional } = require("./condicional");
const { getResultadoSimple } = require("./simple");
const { getResultsHanoi } = require("./hanoi");
const moment = require("moment");
const { getResultsStroop } = require("./stroop");
const { getResultadosFlanker } = require("./flanker");

const formatSingleTestResults = (test, settings, type) => {
  if (!test || !settings) {
    return test;
  }
  let params = {};
  switch (type) {
    case 1:
      params = getResultadoSimple(test.targets, settings);
      test.targets = [...params.targets];
      delete params.targets;
      break;
    case 2:
      params = getResultsCondicional(test.targets, settings);
      test.targets = [...params.targets];
      delete params.targets;
      break;
    case 3:
      break;
    case 4:
      params = getResultsHanoi(test);
      delete params.movements;
      break;
    case 5:
      params = getResultadosFlanker(test, settings);
      test.estimulos = [...params.estimulos];
      delete params.estimulos;
      break;
    case 6:
      params = getResultsStroop(test.estimulos);
      test.estimulos = [...params.estimulos];
      delete params.estimulos;
      break;
  }
  return { ...test, results: params };
};

const formatSummaryTestResults = (results, type) => {
  if (!results) {
    return results;
  }
  switch (type) {
    //Atención Simple
    case 1: {
      const {
        errores,
        aciertos,
        tiempoReaccion,
        clicksCorrectos,
        clicksIncorrectos,
        omisionesCorrectas,
        omisionesIncorrectas,
      } = getResultadoSimple(results.targets, results.settings);
      let estimulos = results.targets.length;
      return {
        erroresSimple: errores,
        aciertosSimple: aciertos,
        estimulosSimple: estimulos,
        tiempoReaccionSimple: tiempoReaccion,
        clicksCorrectosSimple: clicksCorrectos,
        clicksIncorrectosSimple: clicksIncorrectos,
        omisionesCorrectasSimple: omisionesCorrectas,
        omisionesIncorrectasSimple: omisionesIncorrectas,
      };
    }
    //Condicional
    case 2: {
      const {
        errores,
        aciertos,
        tiempoReaccion,
        clicksCorrectos,
        clicksIncorrectos,
        omisionesCorrectas,
        omisionesIncorrectas,
      } = getResultsCondicional(results.targets, results.settings);
      let estimulos = results.targets.length;
      return {
        erroresCondicional: errores,
        aciertosCondicional: aciertos,
        estimulosCondicional: estimulos,
        tiempoReaccionCondicional: tiempoReaccion,
        clicksCorrectosCondicional: clicksCorrectos,
        clicksIncorrectosCondicional: clicksIncorrectos,
        omisionesCorrectasCondicional: omisionesCorrectas,
        omisionesIncorrectasCondicional: omisionesIncorrectas,
      };
    }
    //Torre de Hanoi
    case 4: {
      let { movements } = results;
      const {
        errores1,
        errores2,
        errores3,
        repetidos,
        aciertos,
        tiempoPromedio,
        tiempoReflexion,
      } = getResultsHanoi(movements);
      return {
        aciertosHanoi: aciertos,
        errores1Hanoi: errores1,
        errores2Hanoi: errores2,
        errores3Hanoi: errores3,
        repetidosHanoi: repetidos,
        movimientosHanoi: movements.length,
        tiempoPromedioHanoi: tiempoPromedio,
        tiempoReflexionHanoi: tiempoReflexion,
      };
    }
    case 6: {
      let { estimulos } = results;
      const {
        congruentes,
        incongruentes,
        allCongruentes,
        tiempoReaccion,
        allIncongruentes,
        erroresCongruentes,
        erroresIncongruentes,
      } = getResultsStroop(estimulos);
      return {
        erroresCongruentes,
        erroresIncongruentes,
        congruentes: allCongruentes,
        incongruentes: allIncongruentes,
        aciertosCongruentes: congruentes,
        estimulosStroop: estimulos.length,
        aciertosIncongruentes: incongruentes,
        tiempoReaccionStroop: tiempoReaccion,
      };
    }
    default:
      return results;
  }
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
  let count = 0;
  total.forEach((value) => {
    if (!isNaN(value)) {
      result = parseFloat(result) + parseFloat(value);
      count++;
    }
  });
  let average = result / count;
  return {
    result: parseFloat(average.toFixed(3)),
    average: feature.average,
    dev: feature.dev,
  };
};

const formatTestResults = (test) => {
  let result = {};
  switch (test.type) {
    case 1:
      {
        let { targets } = test.results;
        let { target } = test.results.settings;
        targets.forEach((current, index) => {
          let correct = false;
          if (current.clicked) {
            correct = current.target === target;
          } else {
            correct = current.target !== target;
          }
          result[`x-${test.type}-${index + 1}-click`] = !current.click
            ? "0"
            : "1";
          result[`x-${test.type}-${index + 1}-reaction`] = current.clicked
            ? moment(current.clicked).diff(current.timestamp, "miliseconds")
            : "";
          result[`x-${test.type}-${index + 1}-correct`] = correct ? "1" : "0";
        });
      }
      break;
    case 2:
      {
        let { targets } = test.results;
        let { target, clave } = test.results.settings;
        targets.forEach((current, index) => {
          let correct = getTargetResult(
            current,
            target,
            clave,
            index > 0 ? targets[index - 1] : {}
          );
          result[`x-${test.type}-${index + 1}-click`] = !current.click
            ? "0"
            : "1";
          result[`x-${test.type}-${index + 1}-reaction`] = current.clicked
            ? moment(current.clicked).diff(current.timestamp, "miliseconds")
            : "";
          result[`x-${test.type}-${index + 1}-correct`] = correct ? "1" : "0";
        });
      }
      break;
  }
  return result;
};

module.exports = {
  getNechapiFeature,
  formatTestResults,
  getPuntuacionNechapi,
  formatSingleTestResults,
  formatSummaryTestResults,
};
