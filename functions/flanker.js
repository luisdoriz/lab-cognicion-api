const moment = require("moment");

const getTiempoReaccionFlanker = (estimulos) => {
  let suma = 0;
  let clicks = 0;
  estimulos.forEach((estimulo) => {
    if (estimulo.clicked) {
      suma += moment(estimulo.clicked, "YYYY-MM-DD HH:mm:ss:SSS").diff(
        moment(estimulo.emitted, "YYYY-MM-DD HH:mm:ss:SSS"),
        "miliseconds"
      );
      clicks++;
    }
  });
  return parseFloat(suma / clicks).toFixed(2);
};

const getErroresFlanker = (estimulos, left, right) => {
  let errores = 0;
  estimulos.forEach((estimulo) => {
    if (!estimulo.clicked) errores++;
    else if (
      estimulo.direction === "left" &&
      String(estimulo.char).toLowerCase() !== String(left).toLowerCase()
    )
      errores++;
    else if (
      estimulo.direction === "right" &&
      String(estimulo.char).toLowerCase() !== String(right).toLowerCase()
    )
      errores++;
  });
  return errores;
};

const getOmisionesFlanker = (estimulos) => {
  return estimulos.filter((estimulo) => !estimulo.clicked).length;
};

const getErroresFlankerTipo = (estimulos, type, left, right) => {
  if (type === "direction") {
    estimulos = estimulos.filter((estimulo) => estimulo.clicked);
  } else {
    estimulos = estimulos.filter((estimulo) => estimulo.type === type);
  }
  return getErroresFlanker(estimulos, left, right);
};

const getEstimulosFlanker = (estimulos) => {
  const division = estimulos / 2;
  const seccion = division / 3;
  const divisionSeccion = seccion / 2;
  let estimulosObj = [];
  let position = "top";
  let direction = "left";
  let type = "Congruente";
  for (let i = 0; i < estimulos; i++) {
    if (i > 0 && i % division === 0) {
      position = "bottom";
    }
    if (i % seccion === 0) {
      switch (type) {
        case "Congruente":
          type = "Incongruente";
          break;
        case "Incongruente":
          type = "Neutral";
          break;
        default:
          type = "Congruente";
      }
    }
    if (i % divisionSeccion === 0) {
      if (direction === "left") {
        direction = "right";
      } else {
        direction = "left";
      }
    }
    estimulosObj.push({
      type,
      direction,
      position,
    });
  }
  return estimulosObj;
};

const isValidFlanker = (estimulo, right, left) => {
  let valid = true;
  if (!estimulo.clicked) valid = false;
  else if (
    estimulo.direction === "left" &&
    String(estimulo.char) !== String(left).toLowerCase()
  )
    valid = false;
  else if (
    estimulo.direction === "right" &&
    String(estimulo.char) !== String(right).toLowerCase()
  )
    valid = false;
  return valid;
};

const getResultadosEstimulos = (estimulos, settings) => {
  estimulos.forEach((estimulo) => {
    estimulo.valid = isValidFlanker(
      estimulo,
      settings.righKey,
      settings.leftKey
    );
  });
};

const getResultadosFlanker = (estimulos, settings) => {
  const errores = getErroresFlanker(
    estimulos,
    settings.leftKey,
    settings.rightKey
  );
  const erroresDireccion = getErroresFlankerTipo(
    estimulos,
    "direction",
    left,
    right
  );
  const omisiones = getOmisionesFlanker(estimulos);
  const erroresCongruentes = getErroresFlankerTipo(
    estimulos,
    "Congruente",
    left,
    right
  );
  const erroresIncongruentes = getErroresFlankerTipo(
    estimulos,
    "Incongruente",
    left,
    right
  );
  const erroresNeutrales = getErroresFlankerTipo(
    estimulos,
    "Neutral",
    left,
    right
  );
  const tiempoReaccion = getTiempoReaccionFlanker(estimulos);
  const tiempoTotal = `${moment(finishTime, "YYYY-MM-DD HH:mm:ss:SSS").diff(
    moment(startTime, "YYYY-MM-DD HH:mm:ss:SSS"),
    "seconds"
  )}.${
    moment(finishTime, "YYYY-MM-DD HH:mm:ss:SSS").diff(
      moment(startTime, "YYYY-MM-DD HH:mm:ss:SSS"),
      "miliseconds"
    ) % 1000
  }`;
  return {
    errores,
    omisiones,
    tiempoTotal,
    tiempoReaccion,
    erroresNeutrales,
    erroresDireccion,
    erroresCongruentes,
    erroresIncongruentes,
  };
};

module.exports = {
  getEstimulosFlanker,
  getResultadosFlanker,
  getResultadosEstimulos,
};
