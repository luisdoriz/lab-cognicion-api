const moment = require("moment");

const calculateAverage = (items) => {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i];
  }
  return total / items.length;
};

const getTiempoReaccionStroop = (targets) => {
  let reacciones = targets.map((target) =>
    moment(target.timestamp).diff(target.emitted, "milliseconds")
  );
  return parseInt(calculateAverage(reacciones));
};

const getEstimulosResults = (estimulos, type) => {
  estimulos = estimulos.filter((estimulo) => estimulo.type === type);
  return estimulos.filter((estimulo) => estimulo.clicked === estimulo.display)
    .length;
};

const getResultsStroop = (estimulos) => {
  let aciertos = 0;
  let tiempoTotal = 0;
  let congruentes = 0;
  let incongruentes = 0;
  let allCongruentes = 0;
  let allIncongruentes = 0;
  estimulos = estimulos.map((estimulo) => {
    const reaction = moment(estimulo.timestamp, "YYYY-MM-DD HH:mm:ss:SSS").diff(
      moment(estimulo.emitted, "YYYY-MM-DD HH:mm:ss:SSS"),
      "miliseconds"
    );
    const correct = estimulo.clicked === estimulo.target;

    tiempoTotal += reaction;

    if (correct) aciertos++;

    if (estimulo.type === "congruente") {
      allCongruentes++;

      if (correct) congruentes++;
    } else if (estimulo.type === "incongruente") {
      allIncongruentes++;

      if (correct) incongruentes++;
    }

    return { ...estimulo, reaction, correct };
  });
  let erroresCongruentes = allCongruentes - congruentes;
  let erroresIncongruentes = allIncongruentes - incongruentes;
  let tiempoReaccion = (tiempoTotal / estimulos.length).toFixed(2);
  return {
    aciertos,
    estimulos,
    congruentes,
    incongruentes,
    allCongruentes,
    tiempoReaccion,
    allIncongruentes,
    erroresCongruentes,
    erroresIncongruentes,
  };
};

module.exports = { getResultsStroop };
