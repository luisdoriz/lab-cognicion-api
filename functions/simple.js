const moment = require("moment");

const getTiempoReaccion = (tiempoTotal, clicksCorrectos, clicksIncorrectos) => {
  if (clicksCorrectos + clicksIncorrectos > 0) {
    return tiempoTotal / (clicksCorrectos + clicksIncorrectos);
  }
  return 0;
};

const getTargetResult = (current, target) => {
  if (current.clicked) {
    return current.target === target;
  }
  return current.target !== target;
};

const getTargetReaction = (target) => {
  if (!target.clicked) return null;
  return moment(target.clicked).diff(target.timestamp, "milliseconds");
};

const getResultadoSimple = (targets, settings) => {
  let errores = 0;
  let aciertos = 0;
  let tiempoTotal = 0;
  let clicksCorrectos = 0;
  let clicksIncorrectos = 0;
  let omisionesCorrectas = 0;
  let omisionesIncorrectas = 0;
  targets = targets.map((target) => {
    const reaction = getTargetReaction(target);
    const correct = getTargetResult(target, settings.target);
    if (target.clicked && reaction !== null) {
      tiempoTotal += reaction;
    }
    if (correct) {
      aciertos++;
      if (target.clicked) clicksCorrectos++;
      else omisionesCorrectas++;
    } else {
      errores++;
      if (target.clicked) clicksIncorrectos++;
      else clicksIncorrectos++;
    }
    return {
      ...target,
      reaction,
      correct,
    };
  });
  let tiempoReaccion = getTiempoReaccion(
    tiempoTotal,
    clicksCorrectos,
    clicksIncorrectos
  );
  return {
    targets,
    errores,
    aciertos,
    tiempoReaccion,
    clicksCorrectos,
    clicksIncorrectos,
    omisionesCorrectas,
    omisionesIncorrectas,
  };
};

module.exports = { getResultadoSimple };