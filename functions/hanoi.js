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

const getTiempoPromedio = (movements) => {
  let suma = 0;
  movements.forEach((movement) => {
    suma += moment(movement.timestamp_destino, "YYYY-MM-DD HH:mm:ss:SSS").diff(
      moment(movement.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS"),
      "miliseconds"
    );
  });
  return parseFloat(suma / movements.length).toFixed(2);
};

const getTiempoPromedioReflexion = (movements) => {
  let suma = 0;
  movements.forEach((movement, index) => {
    if (index > 0) {
      suma += moment(movement.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS").diff(
        moment(
          movements[index - 1].timestamp_destino,
          "YYYY-MM-DD HH:mm:ss:SSS"
        ),
        "miliseconds"
      );
    }
  });
  return parseFloat(suma / (movements.length - 1)).toFixed(2);
};

const getConteoRepetidos = (movements) => {
  let repetidos = 0;
  let prevmovement = null;
  movements.forEach((movement) => {
    if (prevmovement === null) {
      prevmovement = movement;
    } else {
      if (
        prevmovement.destino === movement.origen &&
        prevmovement.origen === movement.destino
      ) {
        repetidos++;
      }
    }
  });
  return repetidos;
};

const getResultsHanoi = (test) => {
  const { movements } = test;
  let percepcion = 0;
  let aprendizaje = 0;
  let tiempoTotal = 0;
  let arrepentimiento = 0;
  let tiempoTotalReflexion = 0;
  movements.forEach((movement, index) => {
    switch (movement.error) {
      case "percepcion":
        percepcion++;
        break;
      case "arrepentimiento":
        arrepentimiento++;
        break;
      case "aprendizaje":
        aprendizaje++;
    }
    if (index > 0) {
      tiempoTotal += moment(
        movement.timestamp_destino,
        "YYYY-MM-DD HH:mm:ss:SSS"
      ).diff(
        moment(movement.timestamp_origen, "YYYY-MM-DD HH:mm:ss:SSS"),
        "miliseconds"
      );
      tiempoTotalReflexion += moment(
        movement.timestamp_origen,
        "YYYY-MM-DD HH:mm:ss:SSS"
      ).diff(
        moment(
          movements[index - 1].timestamp_destino,
          "YYYY-MM-DD HH:mm:ss:SSS"
        ),
        "miliseconds"
      );
    }
  });
  let repetidos = getConteoRepetidos(movements);
  let aciertos =
    movements.length - percepcion - arrepentimiento - aprendizaje - repetidos;
  let tiempoReflexion = parseFloat(
    tiempoTotalReflexion / (movements.length - 1)
  ).toFixed(2);
  let tiempoPromedio = parseFloat(tiempoTotal / movements.length).toFixed(2);
  tiempoTotal = getTiempoTotal(test.start, test.end);
  return {
    aciertos,
    repetidos,
    percepcion,
    aprendizaje,
    tiempoTotal,
    arrepentimiento,
    tiempoPromedio,
    tiempoReflexion,
  };
};

module.exports = { getResultsHanoi };
