const models = require("../models");

const { MultiTest, Test, TestType, Survey, SurveyType, AccessUrl } = models;

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

module.exports = { getAllMultiTests, getMultiTestPatient, getMultiTest };
