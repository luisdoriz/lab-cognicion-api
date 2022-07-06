const { Survey } = require("../../models");
const { createAccessUrl } = require("../accessUrls/create");

const postSurvey = async (body) => Survey.create(body);

const createSurvey = async (body) => {
  try {
    const accessUrl = await createAccessUrl();
    idAccessUrl = accessUrl.id;
    const { idUser, idPatient, idSurveyType: type, idMultiTest } = body;
    const surveyBody = {
      idUser,
      idPatient,
      type,
      idAccessUrl,
      idMultiTest,
    };
    test = await postSurvey(surveyBody);
    return test;
  } catch (err) {
    console.log("error", err);
    return null;
  }
};

module.exports = {
  createSurvey,
};
