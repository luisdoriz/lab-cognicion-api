const XLSX = require("xlsx");
const axios = require("axios");
const { getUserTest } = require("../actions/tests/read");
const moment = require("moment");

const getError = (movement) => {
  if (movement.error === "percepcion") return 1;
  if (movement.error === "arrepentimiento") return 2;
  if (movement.error === "aprendizaje") return 3;
  return 0;
};

const parseMovementsToFeatures = (movements) => {
  return movements.map((movement, index) => {
    console.log(movement);
    let delta = Math.abs(
      moment(movement.timestamp_destino).diff(
        movement.timestamp_origen,
        "milliseconds"
      )
    );
    let inter =
      index > 0
        ? Math.abs(
            moment(movement.timestamp_origen).diff(
              moment(movements[index - 1].timestamp_destino),
              "miliseconds"
            )
          )
        : null;
    let error = getError(movement);
    return {
      delta,
      inter,
      error,
      start: movement.origen,
      end: movement.destino,
    };
  });
};

exports.createReportHanoi = async (req, res) => {
  const { idTest } = req.params;
  const test = await getUserTest(idTest);
  const testApiUrl = process.env.TESTS_API;
  url = `${testApiUrl}/results?idTest=${idTest}`;
  const request = await axios.get(url);
  const { data } = request.data;
  let results = {};
  if (data.length > 0) {
    results = data[0];
  }
  const result = { test, results };
  const workbook = XLSX.utils.book_new();
  const movements = parseMovementsToFeatures(result.results.movements);
  const worksheet = XLSX.utils.json_to_sheet(movements);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados");
  XLSX.writeFile(workbook, "./resultados.csv");
  res.sendStatus(200);
};
