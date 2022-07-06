const { Test } = require("../../models");
const { createAccessUrl } = require("../accessUrls/create");

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

module.exports = {
  createTest,
};
