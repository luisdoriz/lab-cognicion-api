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
