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

const getResultsHanoi = (movements) => {
  let errores1 = getConteoErrores(movements, "percepcion");
  let errores2 = getConteoErrores(movements, "arrepentimiento");
  let errores3 = getConteoErrores(movements, "aprendizaje");
  let repetidos = getConteoRepetidos(movements);
  let aciertos = movements.length - errores1 - errores2 - errores3 - repetidos;
  let tiempoReflexion = getTiempoPromedioReflexion(movements);
  let tiempoPromedio = getTiempoPromedio(
    movements.filter((movement) => !movement.error)
  );
  return {
    errores1,
    errores2,
    errores3,
    repetidos,
    aciertos,
    tiempoPromedio,
    tiempoReflexion,
  };
};

module.exports = { getResultsHanoi };
