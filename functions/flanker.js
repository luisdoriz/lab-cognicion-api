const moment = require("moment");

const getTiempoTotal = (startTime, finishTime) => {
  const segundos = moment(finishTime, "YYYY-MM-DD HH:mm:ss:SSS").diff(
    moment(startTime, "YYYY-MM-DD HH:mm:ss:SSS"),
    "seconds"
  );
  const milisegundos =
    moment(finishTime, "YYYY-MM-DD HH:mm:ss:SSS").diff(
      moment(startTime, "YYYY-MM-DD HH:mm:ss:SSS"),
      "miliseconds"
    ) % 1000;
  return `${segundos}.${milisegundos}`;
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

const getResultadosFlanker = (test, settings) => {
  let { estimulos } = test;
  const left = settings.leftKey;
  const right = settings.rightKey;
  let clicks = 0;
  let errores = 0;
  let aciertos = 0;
  let omisiones = 0;
  let tiempoTotal = 0;
  let erroresNeutrales = 0;
  let erroresDireccion = 0;
  let erroresCongruentes = 0;
  let erroresIncongruentes = 0;
  estimulos = estimulos.map((estimulo) => {
    const valid = isValidFlanker(estimulo, right, left);
    if (!valid) {
      if (estimulo.clicked) {
        erroresDireccion++;

        clicks++;

        tiempoTotal += moment(estimulo.clicked, "YYYY-MM-DD HH:mm:ss:SSS").diff(
          moment(estimulo.emitted, "YYYY-MM-DD HH:mm:ss:SSS"),
          "miliseconds"
        );
      } else {
        omisiones++;
      }

      if (estimulo.type === "Congruente") erroresCongruentes++;
      else if (estimulo.type === "Incongruente") erroresIncongruentes++;
      else erroresNeutrales++;

      errores++;
    } else {
      clicks++;

      tiempoTotal += moment(estimulo.clicked, "YYYY-MM-DD HH:mm:ss:SSS").diff(
        moment(estimulo.emitted, "YYYY-MM-DD HH:mm:ss:SSS"),
        "miliseconds"
      );

      aciertos++;
    }
    return { ...estimulo, valid };
  });

  const tiempoReaccion = parseFloat(tiempoTotal / clicks).toFixed(2);
  tiempoTotal = getTiempoTotal(test.startTime, test.endTime);
  return {
    errores,
    aciertos,
    estimulos,
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
  getResultadosFlanker,
  getEstimulosFlanker,
};
