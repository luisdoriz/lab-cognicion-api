const models = require("../models");
const axios = require("axios");

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
    let tests = await Test.findAll({
      where: {
        idMultiTest,
      },
      include: [{ model: Patient, required: true, as: "patient" }],
    });
    const testApiUrl = process.env.TESTS_API;
    const promises = [];
    tests = tests.map((test) => test.toJSON());
    let processed = [];
    tests.forEach((test) => {
      const promise = new Promise((resolve, reject) => {
        let url = `${testApiUrl}/results?idTest=${test.id}`;
        axios
          .get(url)
          .then((request) => {
            const { data } = request.data;
            let results = {};
            if (data.length > 0) {
              results = data[0];
            }
            let currentTest = { ...test, ...results };
            processed.push(currentTest);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
      promises.push(promise);
    });
    await Promise.all(promises);
    processed = processed.map((test) => {
      let current = { ...test };
      Object.keys(current).forEach((key) => {
        if (key === "accessUrl") {
          delete current[key];
        } else if (
          typeof current[key] === "object" &&
          !Array.isArray(current[key])
        ) {
          current = { ...current, ...current[key] };
          delete current[key];
        }
      });
      return current;
    });
    processed = processed.map((test) => {
      let current = { ...test };
      Object.keys(current).forEach((key) => {
        if (key === "accessUrl") {
          delete current[key];
        } else if (
          typeof current[key] === "object" &&
          !Array.isArray(current[key])
        ) {
          current = { ...current, ...current[key] };
          delete current[key];
        }
      });
      return current;
    });
    res.status(200).send({ tests: processed });
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
