const { Survey } = require('../../models');
const { createAccessUrl } = require('../accessUrls/create');

const postSurvey = async (body) =>  Survey.create(body);

const createSurvey = async (body) =>  {
    try {
        const accessUrl = await createAccessUrl()
        idAccessUrl = accessUrl.id
        const testBody = {
            idUser: body.idUser,
            idPatient: body.idPatient,
            type: body.idSurveyType,
            idAccessUrl,
        }
        test = await postSurvey(testBody)
        return test
    } catch(err) {
        console.log("error", err)
        return null
    }
};


module.exports = {
    createSurvey,
  };
