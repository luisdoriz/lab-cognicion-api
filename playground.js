const {
  formatTestResults,
  getResultadoTargetsCondicional,
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

testCondicional();
