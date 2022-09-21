const models = require("../models");
const axios = require("axios");
const {
  getResultadoTargets,
  getTiempoReaccion,
  getResultadoTargetsCondicional,
  getConteoErrores,
  getConteoRepetidos,
  getTiempoPromedioReflexion,
  getTiempoPromedio,
  getEstimulosResults,
  getTiempoReaccionStroop,
  getTargetResult,
  getAciertosCondicional,
  formatTestResults,
  formatSummaryTestResults,
} = require("../functions/tests");
const testApiUrl = process.env.TESTS_API;
const { MultiTest, Test, TestType, Survey, SurveyType, AccessUrl, Patient } =
  models;

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
    const promises = [];
    patients.forEach((patient) => {
      let tests = patient.tests;
      tests.forEach((currentTest) => {
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
    res.status(200).send({ patients });
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
