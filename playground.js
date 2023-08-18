const {
  formatTestResults,
  getResultadoTargetsCondicional,
  formatSingleTestResults,
} = require("./functions/tests");
const XLSX = require("xlsx");
const moment = require("moment");

const test = {
  id: 703,
  name: null,
  idAccessUrl: 609,
  idUser: 2,
  type: 1,
  idPatient: 82,
  order: null,
  createdAt: "2022-07-01T16:08:45.000Z",
  updatedAt: "2022-07-01T16:08:45.000Z",
  idMultiTest: 2,
  results: {
    _id: "62bf1d8c569628c4dd2d0f6b",
    start: "2022-07-01T16:14:57.369Z",
    end: "2022-07-01T16:15:08.370Z",
    targets: [
      {
        timestamp: "2022-07-01T16:14:58.374Z",
        target: "L",
      },
      {
        timestamp: "2022-07-01T16:14:59.373Z",
        target: "O",
      },
      {
        timestamp: "2022-07-01T16:15:00.372Z",
        target: "V",
      },
      {
        timestamp: "2022-07-01T16:15:01.373Z",
        target: "M",
      },
      {
        timestamp: "2022-07-01T16:15:02.372Z",
        target: "J",
      },
      {
        timestamp: "2022-07-01T16:15:03.373Z",
        target: "V",
      },
      {
        timestamp: "2022-07-01T16:15:04.372Z",
        target: "X",
        clicked: "2022-07-01T16:15:04.825Z",
        character: " ",
      },
      {
        timestamp: "2022-07-01T16:15:05.373Z",
        target: "L",
      },
      {
        timestamp: "2022-07-01T16:15:06.373Z",
        target: "Q",
      },
      {
        timestamp: "2022-07-01T16:15:07.374Z",
        target: "W",
      },
    ],
    target: "X",
    finished: true,
    idTest: 703,
    idPatient: 82,
    config: 1,
    idUser: 2,
    createdAt: "2022-07-01 16:15:08.834000",
    updatedAt: "2022-07-01 16:15:08.834000",
    settings: {
      _id: "62bf19e070639fe5022fdad8",
      results: {},
      idTestType: 1,
      tiempoExposicion: "500",
      tiempoInterestimular: "500",
      target: "X",
      fontFamily: "Courier",
      fontStyle: "Normal",
      fontSize: "100",
      color: "#000000",
      backgroundColor: "#cccccc",
      numeroEstimulos: 10,
      aparicion: 10,
      keyCode: "32",
      duracion: "10",
      idPatient: 82,
      idUser: 2,
      idTest: 703,
      createdAt: "2022-07-01 16:08:45.797000",
      updatedAt: "2022-07-01 16:08:45.797000",
      id: 698,
      name: null,
      idAccessUrl: 603,
      type: 1,
      order: 1,
      idMultiTest: 2,
      accessUrl: {
        id: 603,
        token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZEFjY2Vzc1VybCI6NjAzLCJleHAiOjE2NjQ2Mzk5Njc2Njd9.Nn5ELwxEtwGad2KGhGMkETq_xNIlriNZzSs7HtFzrB0",
        url: null,
        isPublic: null,
        expirationDate: "2022-10-01T15:59:27.000Z",
        createdAt: "2022-07-01T15:59:27.000Z",
        updatedAt: "2022-07-01T15:59:27.000Z",
      },
      testType: {
        id: 1,
        name: "Atencion Simple",
        handle: "atencion",
        createdAt: "2021-03-09T02:52:32.000Z",
        updatedAt: "2021-03-09T02:52:32.000Z",
      },
      patient: null,
    },
  },
};

let condicional = {
  target: "A",
  clave: "X",
  targets: [
    {
      target: "A",
      timestamp: "2022-07-01T16:50:49.961Z",
    },
    {
      target: "W",
      timestamp: "2022-07-01T16:50:50.962Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:50:51.960Z",
      clicked: "2022-07-01T16:50:52.511Z",
      character: " ",
    },
    {
      target: "U",
      timestamp: "2022-07-01T16:50:52.960Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:50:53.962Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:50:54.960Z",
    },
    {
      target: "M",
      timestamp: "2022-07-01T16:50:55.960Z",
      clicked: "2022-07-01T16:50:56.317Z",
      character: " ",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:50:56.959Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:50:57.960Z",
      clicked: "2022-07-01T16:50:58.359Z",
      character: " ",
    },
    {
      target: "H",
      timestamp: "2022-07-01T16:50:58.961Z",
    },
    {
      target: "L",
      timestamp: "2022-07-01T16:50:59.962Z",
    },
    {
      target: "Q",
      timestamp: "2022-07-01T16:51:00.958Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:01.959Z",
    },
    {
      target: "M",
      timestamp: "2022-07-01T16:51:02.961Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:03.960Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:04.963Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:05.961Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:06.961Z",
    },
    {
      target: "B",
      timestamp: "2022-07-01T16:51:07.962Z",
    },
    {
      target: "V",
      timestamp: "2022-07-01T16:51:08.961Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:09.960Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:10.958Z",
    },
    {
      target: "E",
      timestamp: "2022-07-01T16:51:11.960Z",
    },
    {
      target: "T",
      timestamp: "2022-07-01T16:51:12.960Z",
    },
    {
      target: "B",
      timestamp: "2022-07-01T16:51:13.959Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:14.958Z",
    },
    {
      target: "L",
      timestamp: "2022-07-01T16:51:15.963Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:16.960Z",
    },
    {
      target: "Q",
      timestamp: "2022-07-01T16:51:17.961Z",
    },
    {
      target: "S",
      timestamp: "2022-07-01T16:51:18.963Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:19.958Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:20.959Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:21.963Z",
      clicked: "2022-07-01T16:51:22.680Z",
      character: " ",
    },
    {
      target: "N",
      timestamp: "2022-07-01T16:51:22.959Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:23.960Z",
    },
    {
      target: "H",
      timestamp: "2022-07-01T16:51:24.962Z",
    },
    {
      target: "X",
      timestamp: "2022-07-01T16:51:25.962Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:26.960Z",
    },
    {
      target: "T",
      timestamp: "2022-07-01T16:51:27.961Z",
    },
    {
      target: "A",
      timestamp: "2022-07-01T16:51:28.959Z",
    },
  ],
};

function formatExcel(result) {
  const workbook = XLSX.utils.book_new();
  const movesWS = XLSX.utils.json_to_sheet([result]);
  XLSX.utils.book_append_sheet(workbook, movesWS, "Atencion");
  const fileName = `Report_${moment().format("YYYY-MM-DD_HH:mm")}`;
  XLSX.writeFile(workbook, `${__dirname}/files/${fileName}.xlsx`);
}

function testCondicional() {
  let { clave, targets, target } = condicional;
  let aciertos = getResultadoTargetsCondicional(
    targets,
    target,
    "click",
    clave,
    true
  );
  console.log(aciertos);
}

const result = {
  _id: {
    $oid: "64dfff195bc15aeb5facca67",
  },
  idTest: 28,
  device:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  idUser: 1,
  targets: [],
  startTime: {
    $date: "2023-08-18T22:30:38.895Z",
  },
  endTime: "2023-08-18 17:31:03:427",
  estimulos: [
    {
      emitted: "2023-08-18 17:30:38:897",
      type: "incongruente",
      target: "verde",
      display: "rojo",
      index: 0,
      clicked: "verde",
      timestamp: "2023-08-18 17:30:40.437",
      reaction: 1540,
      correct: false,
    },
    {
      emitted: "2023-08-18 17:30:41:447",
      type: "congruente",
      target: "verde",
      display: "verde",
      index: 1,
      clicked: "verde",
      timestamp: "2023-08-18 17:30:42.133",
      reaction: 686,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:43:144",
      type: "incongruente",
      target: "rojo",
      display: "azul",
      index: 2,
      clicked: "rojo",
      timestamp: "2023-08-18 17:30:44.048",
      reaction: 904,
      correct: false,
    },
    {
      emitted: "2023-08-18 17:30:45:055",
      type: "congruente",
      target: "azul",
      display: "azul",
      index: 3,
      clicked: "azul",
      timestamp: "2023-08-18 17:30:46.239",
      reaction: 1184,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:47:248",
      type: "incongruente",
      target: "rojo",
      display: "azul",
      index: 4,
      clicked: "rojo",
      timestamp: "2023-08-18 17:30:48.444",
      reaction: 1196,
      correct: false,
    },
    {
      emitted: "2023-08-18 17:30:49:456",
      type: "congruente",
      target: "rojo",
      display: "rojo",
      index: 5,
      clicked: "rojo",
      timestamp: "2023-08-18 17:30:50.331",
      reaction: 875,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:51:335",
      type: "congruente",
      target: "rojo",
      display: "rojo",
      index: 6,
      clicked: "rojo",
      timestamp: "2023-08-18 17:30:52.041",
      reaction: 706,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:53:046",
      type: "incongruente",
      target: "azul",
      display: "rojo",
      index: 7,
      clicked: "azul",
      timestamp: "2023-08-18 17:30:54.205",
      reaction: 1159,
      correct: false,
    },
    {
      emitted: "2023-08-18 17:30:55:216",
      type: "congruente",
      target: "verde",
      display: "verde",
      index: 8,
      clicked: "verde",
      timestamp: "2023-08-18 17:30:56.124",
      reaction: 908,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:57:128",
      type: "congruente",
      target: "azul",
      display: "azul",
      index: 9,
      clicked: "azul",
      timestamp: "2023-08-18 17:30:58.180",
      reaction: 1052,
      correct: true,
    },
    {
      emitted: "2023-08-18 17:30:59:184",
      type: "incongruente",
      target: "verde",
      display: "rojo",
      index: 10,
      clicked: "verde",
      timestamp: "2023-08-18 17:31:00.356",
      reaction: 1172,
      correct: false,
    },
    {
      emitted: "2023-08-18 17:31:01:359",
      type: "incongruente",
      target: "azul",
      display: "rojo",
      index: 11,
      clicked: "azul",
      timestamp: "2023-08-18 17:31:02.414",
      reaction: 1055,
      correct: false,
    },
  ],
  movements: [],
  idPatient: 1,
  finished: true,
  idTestType: 6,
  __v: 0,
};

const settings = {
  _id: {
    $oid: "64dfff195bc15aeb5facca67",
  },
  idUser: 1,
  idTest: 28,
  idPatient: 1,
  idTestType: 6,
  tiempoInterestimular: "1000",
  fontFamily: "Courier",
  fontStyle: "Normal",
  fontSize: "100",
  backgroundColor: "#000",
  numeroEstimulos: 12,
  coherencia: 50,
  __v: 0,
};

function main() {
  let results = formatSingleTestResults(result, settings, 6);
  console.log(results);
}

main();
