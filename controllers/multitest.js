const models = require("../models");
const axios = require("axios");
const { formatSummaryTestResults } = require("../functions/tests");
const testApiUrl = process.env.TESTS_API;
const { MultiTest, Test, TestType, Survey, SurveyType, AccessUrl, Patient } =
  models;
const XLSX = require("xlsx");
const moment = require("moment");

const getAllMultiTests = async (req, res, next) => {
  try {
    const multitests = await MultiTest.findAll({
      include: { model: Test, as: "tests" },
    });
    res.status(200).send({ multitests });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMultiTest = async (req, res, next) => {
  try {
    const { idMultiTest } = req.params;
    const singleMultiTest = await MultiTest.findOne({
      where: {
        idMultiTest,
      },
      include: [
        {
          model: Test,
          as: "tests",
          include: [
            {
              model: TestType,
              as: "testType",
            },
            {
              model: AccessUrl,
              as: "accessUrl",
            },
          ],
        },
        {
          model: Survey,
          as: "surveys",
          include: [
            {
              model: SurveyType,
              as: "surveyType",
            },
            {
              model: AccessUrl,
              as: "accessUrl",
            },
          ],
        },
      ],
    });
    res.status(200).send({ multitest: singleMultiTest });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMultiTestPatient = async (req, res, next) => {
  try {
    const { idMultiTest, idPatient } = req.params;
    const singleMultiTest = await MultiTest.findOne({
      where: {
        idMultiTest,
      },
      include: [
        {
          model: Test,
          as: "tests",
          include: {
            model: TestType,
            as: "testType",
          },
          where: {
            idPatient,
          },
        },
        {
          model: Survey,
          as: "surveys",
          include: {
            model: SurveyType,
            as: "surveyType",
          },
        },
      ],
    });
    res.status(200).send({ multitest: singleMultiTest });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getMultiTestReport = async (req, res, next) => {
  try {
    const { idMultiTest } = req.params;
    let patients = await Patient.findAll({
      include: [
        {
          model: Test,
          as: "tests",
          where: {
            idMultiTest,
          },
        },
      ],
    });
    patients = patients.map((current) => current.toJSON());
    let pageSize = 10;
    let iterations = Math.ceil(patients.length / pageSize);
    let excludeCols = [
      "drugsConsumption",
      "drugsTreatment",
      "whichDrugs",
      "antecedent",
      "birthDate",
      "deletedAt",
      "updatedAt",
      "dose",
    ];
    for (let i = 0; i < iterations; i++) {
      let currentPatients = patients.slice(
        i * pageSize,
        i * pageSize + pageSize
      );
      const promises = [];
      currentPatients.forEach((patient) => {
        excludeCols.forEach((key) => {
          delete patient[key];
        });
        patient.tests.forEach((currentTest) => {
          promises.push(
            new Promise((resolve, reject) => {
              axios
                .get(`${testApiUrl}/results?idTest=${currentTest.id}`)
                .then((result) => {
                  let results = result.data.data[0];
                  currentTest.results = formatSummaryTestResults(
                    results,
                    currentTest.type
                  );
                  resolve();
                })
                .catch(reject);
            })
          );
        });
      });
      await Promise.all(promises);
    }
    let patientResult = [];
    patients.forEach((patient) => {
      let tests = patient.tests;
      tests.sort((a, b) => (a.type < b.type ? -1 : 1));
      let numberGroups = tests.filter((test) => test.type === 1).length;
      let types = new Set();
      let processed = new Set();
      tests.forEach((test) => types.add(test.type));
      let groups = [];
      console.log(numberGroups);
      for (let i = 0; i < numberGroups; i++) {
        if (!Array.isArray(groups[i])) {
          groups[i] = [];
        }
        types.forEach((type) => {
          let current = tests.find(
            (test) => test.type === type && !processed.has(test.id)
          );
          if (current) {
            groups[i].push(current.id);
            processed.add(current.id);
          }
        });
      }
      patient.groups = groups;
      groups.forEach((group) => {
        patientResult.push(patient);
        let index = patientResult.length - 1;
        let currentPatient = patientResult[index];
        group.forEach((idTest) => {
          let current = patient.tests.find((test) => test.id === idTest);
          if (current.results) {
            Object.keys(current.results).forEach((key) => {
              currentPatient[key] = current.results[key];
            });
          }
        });
      });
      delete patient.tests;
      delete patient.groups;
    });
    const workbook = XLSX.utils.book_new();
    const patientsWS = XLSX.utils.json_to_sheet(patients);
    XLSX.utils.book_append_sheet(workbook, patientsWS, "Pacientes");
    const fileName = `MultiTestReport_${idMultiTest}_${moment().format(
      "YYYY-MM-DD_HH:mm"
    )}`;
    const filePath = `${__dirname}/files/${fileName}.xlsx`;
    XLSX.writeFile(workbook, `${__dirname}/files/${fileName}.xlsx`);
    res.sendFile(filePath);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  getAllMultiTests,
  getMultiTestPatient,
  getMultiTest,
  getMultiTestReport,
};
