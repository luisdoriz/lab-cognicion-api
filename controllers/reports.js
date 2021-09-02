const XLSX = require("xlsx");
const axios = require("axios");
const { getUserTest } = require("../actions/tests/read");
const moment = require("moment");

const parseMoves = (results, testType) => {
  let moves;
  if (testType.id === 4) {
    moves = results.movements;
    if (!moves) return [];
    moves = moves.map((move) => ({
      ...move,
      reaction: moment(move.timestamp_destino).diff(move.timestamp_origen),
    }));
    moves.forEach((move) => {
      delete move.timestamp_destino;
      delete move.timestamp_origen;
    });
  } else if (testType.id === 5) {
    moves = results.estimulos;
    if (!moves) return [];
    moves = moves.map((move) => ({
      ...move,
      reaction: moment(move.clicked).diff(move.emitted),
    }));
    moves.forEach((move) => {
      delete move.clicked;
      delete move.emitted;
    });
  }
  return moves;
};

const getError = (movement) => {
  if (movement.error === "percepcion") return 1;
  if (movement.error === "arrepentimiento") return 2;
  if (movement.error === "aprendizaje") return 3;
  return 0;
};

const parseMovementsToFeatures = (movements) => {
  return movements.map((movement, index) => {
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
  const moves = parseMoves(results, test.testType);
  const movesWS = XLSX.utils.json_to_sheet(moves);
  const patientWS = XLSX.utils.json_to_sheet([result.test.patient.dataValues]);
  const configWS = XLSX.utils.json_to_sheet([result.results.settings]);
  XLSX.utils.book_append_sheet(workbook, movesWS, "Movimientos");
  XLSX.utils.book_append_sheet(workbook, patientWS, "Paciente");
  XLSX.utils.book_append_sheet(workbook, configWS, "Parámetros");
  const fileName = `Test_${idTest}_${moment().format("YYYY-MM-DD_HH:mm")}`;
  XLSX.writeFile(workbook, `${__dirname}/files/${fileName}.xlsx`);
  res.download(`${__dirname}/files/${fileName}.xlsx`, `${fileName}.xlsx`);
};

exports.createFeaturesHanoi = async (req, res) => {
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
