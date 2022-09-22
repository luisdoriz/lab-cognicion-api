const { categoriasNechapi } = require("../constants/utils");
const moment = require("moment");

const formatSummaryTestResults = (results, type) => {
  if (!results) {
    return results;
  }
  switch (type) {
    //Atención Simple
    case 1: {
      let aciertos = getResultadoTargets(
        results.targets,
        results.settings.target,
        "aciertos"
      );
      let errores = getResultadoTargets(
        results.targets,
        results.settings.target,
        "errores"
      );
      let omisionesCorrectas = getResultadoTargets(
        results.targets,
        results.settings.target,
        "omision",
        true
      );
      let omisionesIncorrectas = getResultadoTargets(
        results.targets,
        results.settings.target,
        "omision"
      );
      let clicksCorrectos = getResultadoTargets(
        results.targets,
        results.settings.target,
        "click",
        true
      );
      let clicksIncorrectos = getResultadoTargets(
        results.targets,
        results.settings.target,
        "click"
      );
      let tiempoReaccion = getTiempoReaccion(
        results.targets.filter((target) =>
          getTargetResult(target, results.settings.target)
        )
      );
      let estimulos = results.targets.length;
      return {
        estimulosSimple: estimulos,
        aciertosSimple: aciertos,
        erroresSimple: errores,
        omisionesCorrectasSimple: omisionesCorrectas,
        omisionesIncorrectasSimple: omisionesIncorrectas,
        clicksCorrectosSimple: clicksCorrectos,
        clicksIncorrectosSimple: clicksIncorrectos,
        tiempoReaccionSimple: tiempoReaccion,
      };
    }
    //Condicional
    case 2: {
      let clave = results.settings.clave;
      let aciertos = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "aciertos",
        clave
      );
      let errores = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "errores",
        clave
      );
      let omisionesCorrectas = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "omision",
        clave,
        true
      );
      let omisionesIncorrectas = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "omision",
        clave
      );
      let clicksCorrectos = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "click",
        clave,
        true
      );
      let clicksIncorrectos = getResultadoTargetsCondicional(
        results.targets,
        results.settings.target,
        "click",
        clave
      );
      let aciertosCondicional = getAciertosCondicional(
        results.targets,
        results.settings.target,
        results.settings.clave
      );
      let tiempoReaccion = getTiempoReaccion(aciertosCondicional);
      let estimulos = results.targets.length;
      return {
        estimulosCondicional: estimulos,
        aciertosCondicional: aciertos,
        erroresCondicional: errores,
        omisionesCorrectasCondicional: omisionesCorrectas,
        omisionesIncorrectasCondicional: omisionesIncorrectas,
        clicksCorrectosCondicional: clicksCorrectos,
        clicksIncorrectosCondicional: clicksIncorrectos,
        tiempoReaccionCondicional: tiempoReaccion,
      };
    }
    //Torre de Hanoi
    case 4: {
      let { movements } = results;
      let errores1 = getConteoErrores(movements, "percepcion");
      let errores2 = getConteoErrores(movements, "arrepentimiento");
      let errores3 = getConteoErrores(movements, "aprendizaje");
      let repetidos = getConteoRepetidos(movements);
      let aciertos =
        movements.length - errores1 - errores2 - errores3 - repetidos;
      let tiempoReflexion = getTiempoPromedioReflexion(movements);
      let tiempoPromedio = getTiempoPromedio(
        movements.filter((movement) => !movement.error)
      );
      return {
        movimientosHanoi: movements.length,
        aciertosHanoi: aciertos,
        errores1Hanoi: errores1,
        errores2Hanoi: errores2,
        errores3Hanoi: errores3,
        repetidosHanoi: repetidos,
        tiempoPromedioHanoi: tiempoPromedio,
        tiempoReflexionHanoi: tiempoReflexion,
      };
    }
    case 6: {
      let { estimulos } = results;
      let allCongruentes = estimulos.filter(
        (estimulo) => estimulo.type === "congruente"
      ).length;
      let allIncongruentes = estimulos.length - allCongruentes;
      let congruentes = getEstimulosResults(estimulos, "congruente");
      let incongruentes = getEstimulosResults(estimulos, "incongruente");
      let erroresIncongruentes = allIncongruentes - incongruentes;
      let erroresCongruentes = allCongruentes - congruentes;
      let tiempoReaccion = getTiempoReaccionStroop(
        estimulos.filter((estimulo) => estimulo.clicked === estimulo.display)
      );
      return {
        estimulosStroop: estimulos.length,
        congruentes: allCongruentes,
        incongruentes: allIncongruentes,
        aciertosCongruentes: congruentes,
        erroresCongruentes,
        aciertosIncongruentes: incongruentes,
        erroresIncongruentes,
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

const getTargetResultCondicional = (current, target, clave, prevItem) => {
  if (current.clicked) {
    return current.target === target && prevItem.target === clave;
  }
  if (current.target === target) {
    return prevItem.target !== clave;
  }
  if (prevItem.target !== clave) {
    return current.target !== target;
  }
  return current.target !== target;
};

const getTargetResult = (current, target) => {
  if (current.clicked) {
    return current.target === target;
  }
  return current.target !== target;
};

const getResultadoTargets = (targets, character, type, correct) => {
  switch (type) {
    case "aciertos":
      return targets.filter((target) => getTargetResult(target, character))
        .length;
    case "errores":
      return targets.filter((target) => !getTargetResult(target, character))
        .length;
    case "click":
      targets = targets.filter((target) => target.clicked);
      if (correct) {
        return targets.filter((target) => getTargetResult(target, character))
          .length;
      }
      return targets.filter((target) => !getTargetResult(target, character))
        .length;
    default:
      targets = targets.filter((target) => !target.clicked);
      if (correct) {
        targets = targets.filter((target) =>
          getTargetResult(target, character)
        );
        return targets.length;
      }
      return targets.filter((target) => !getTargetResult(target, character))
        .length;
  }
};

const calculateAverage = (items) => {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i];
  }
  return total / items.length;
};

const getTiempoReaccion = (targets) => {
  let clicks = targets.filter((target) => target.clicked);
  let reacciones = clicks.map((target) =>
    moment(target.clicked).diff(target.timestamp, "milliseconds")
  );
  return parseInt(calculateAverage(reacciones));
};

const getTiempoReaccionStroop = (targets) => {
  let reacciones = targets.map((target) =>
    moment(target.timestamp).diff(target.emitted, "milliseconds")
  );
  return parseInt(calculateAverage(reacciones));
};

const getAciertosCondicional = (targets, character, prevCharacter) => {
  return targets.filter((target, index) => {
    if (index === 0) {
      return !target.clicked;
    } else {
      if (target.target === character) {
        if (targets[index - 1].target === prevCharacter) {
          return target.clicked;
        }
      }
      return !target.clicked;
    }
  });
};

const getResultadoTargetsCondicional = (
  targets,
  character,
  type,
  prevCharacter,
  correct
) => {
  switch (type) {
    case "aciertos":
      return targets.filter((target, index) => {
        if (index === 0) {
          return !target.clicked;
        } else {
          if (target.target === character) {
            if (targets[index - 1].target === prevCharacter) {
              return target.clicked;
            }
          }
          return !target.clicked;
        }
      }).length;
    case "errores":
      return targets.filter((target, index) => {
        if (index === 0) {
          return target.clicked;
        } else {
          if (target.target === character) {
            if (targets[index - 1].target === prevCharacter) {
              return !target.clicked;
            }
          }
          return target.clicked;
        }
      }).length;
    case "click":
      return targets.filter((target, index) => {
        if (target.clicked) {
          if (correct) {
            return getTargetResultCondicional(
              target,
              character,
              prevCharacter,
              index > 0 ? targets[index - 1] : {}
            );
          } else {
            return !getTargetResultCondicional(
              target,
              character,
              prevCharacter,
              index > 0 ? targets[index - 1] : {}
            );
          }
        }
        return false;
      }).length;
    default:
      //Omisiones
      return targets.filter((target, index) => {
        if (!target.clicked) {
          if (correct) {
            if (index === 0) {
              return true;
            }
            return getTargetResultCondicional(
              target,
              character,
              prevCharacter,
              index > 0 ? targets[index - 1] : {}
            );
          } else {
            return !getTargetResultCondicional(
              target,
              character,
              prevCharacter,
              index > 0 ? targets[index - 1] : {}
            );
          }
        }
        return false;
      }).length;
  }
};

const getConteoErrores = (movimientos, error) => {
  return movimientos.filter((movimiento) => movimiento.error === error).length;
};

const getConteoRepetidos = (movimientos) => {
  let repetidos = 0;
  let prevMovimiento = null;
  movimientos.forEach((movimiento) => {
    if (prevMovimiento === null) {
      prevMovimiento = movimiento;
    } else {
      if (
        prevMovimiento.destino === movimiento.origen &&
        prevMovimiento.origen === movimiento.destino
      ) {
        repetidos++;
      }
    }
  });
  return repetidos;
};

const getTiempoPromedioReflexion = (movimientos) => {
  let suma = 0;
  movimientos.forEach((movimiento, index) => {
    if (index > 0) {
      suma += moment(
        movimiento.timestamp_origen,
        "YYYY-MM-DD HH:mm:ss:SSS"
      ).diff(
        moment(
          movimientos[index - 1].timestamp_destino,
          "YYYY-MM-DD HH:mm:ss:SSS"
        ),
        "miliseconds"
      );
    }
  });
  return parseFloat(suma / (movimientos.length - 1)).toFixed(2);
};

const getTiempoPromedio = (movimientos) => {
  let suma = 0;
  movimientos.forEach((movimiento) => {
    suma += moment(
      movimiento.timestamp_destino,
      "YYYY-MM-DD HH:mm:ss:SSS"
    ).diff(
      moment(movimiento.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS"),
      "miliseconds"
    );
  });
  return parseFloat(suma / movimientos.length).toFixed(2);
};

const getEstimulosResults = (estimulos, type) => {
  estimulos = estimulos.filter((estimulo) => estimulo.type === type);
  return estimulos.filter((estimulo) => estimulo.clicked === estimulo.display)
    .length;
};

module.exports = {
  getTargetResult,
  getPuntuacionNechapi,
  getNechapiFeature,
  formatTestResults,
  getResultadoTargets,
  getTiempoReaccion,
  getConteoErrores,
  getTiempoPromedio,
  getConteoRepetidos,
  getEstimulosResults,
  getAciertosCondicional,
  getTiempoReaccionStroop,
  formatSummaryTestResults,
  getTiempoPromedioReflexion,
  getResultadoTargetsCondicional,
};
