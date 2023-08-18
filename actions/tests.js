const { Op } = require("sequelize");
const models = require("../models");
const { createAccessUrl } = require("./accessUrls");
const { Test, AccessUrl, TestType, Patient, User, Damage } = models;

const getTestByQuery = async (query) => {
  if ("startDate" in query) {
    if ("endDate" in query) {
      endDate = new Date(query.endDate);
      delete query.endDate;
    } else {
      endDate = new Date();
    }
    start_date = new Date(query.startDate);
    delete query.startDate;
    query.createdAt = {
      [Op.between]: [start_date, endDate],
    };
  }
  if (query.idPatient === "") {
    delete query.idPatient;
  }
  query = {
    where: query,
    order: [["id", "DESC"]],
  };
  query.include = [
    {
      model: AccessUrl,
      as: "accessUrl",
    },
    {
      model: TestType,
      as: "testType",
    },
    {
      model: Patient,
      as: "patient",
      where: {
        deletedAt: null,
      },
    },
  ];
  return Test.findAll(query);
};

const getById = async (query) => {
  let currentTest = await Test.findOne({
    where: query,
    include: [
      {
        model: AccessUrl,
        as: "accessUrl",
      },
      {
        model: TestType,
        as: "testType",
      },
      {
        model: Patient,
        as: "patient",
        include: {
          model: Damage,
          as: "damages",
        },
      },
    ],
  });
  if (currentTest === null) return currentTest;
  return currentTest.toJSON();
};

const getUserTests = async (idUser = false) => {
  if (idUser) {
    const results = await getTestByQuery({ idUser });
    return results;
  }
  const results = await getTestByQuery({});
  return results;
};

const getUserTest = async (id) => {
  const results = await getById({ id });
  return results;
};

const getByAccessUrlId = async (id) => {
  let currentTest = await Test.findOne({
    include: [
      {
        model: AccessUrl,
        as: "accessUrl",
        where: {
          id,
        },
      },
      {
        model: TestType,
        as: "testType",
      },
      {
        model: User,
        as: "user",
      },
      {
        model: Patient,
        as: "patient",
      },
    ],
  });
  if (currentTest === null) return currentTest;
  return currentTest.toJSON();
};
const postTest = async (body) => Test.create(body);

const createTest = async (body) => {
  try {
    const accessUrl = await createAccessUrl();
    idAccessUrl = accessUrl.id;
    const testBody = {
      idUser: body.idUser,
      idPatient: body.idPatient,
      type: body.idTestType,
      idAccessUrl,
      idMultiTest: body.idMultiTest,
    };
    test = await postTest(testBody);
    return test;
  } catch (err) {
    console.log("error", err);
    return null;
  }
};

const updateTest = async (data) => {
  await Test.update(data, {
    where: {
      id: data.id,
    },
  });
  return getById(data.id);
};

module.exports = {
  getByAccessUrlId,
  getTestByQuery,
  getUserTests,
  getUserTest,
  createTest,
  updateTest,
  getById,
};
