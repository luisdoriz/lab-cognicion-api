const { Test } = require('../../models');
const { createAccessUrl } = require('../accessUrls/create');

const postTest = async (body) =>  Test.create(body);

const createTest = async (body) =>  {
    try {
        if (body.idAccessUrl) {
            idAccessUrl = body.idAccessUrl
        } else {
            const accessUrl = await createAccessUrl()
            idAccessUrl = accessUrl.id
        }
        const testBody = {
            idUser: body.profesional,
            idPatient: body.paciente,
            type: body.idPrueba,
            idAccessUrl,
        }
        test = await postTest(testBody)
        return test
    } catch(err) {
        console.log("error", err)
        return null
    }
};


module.exports = {
    createTest,
  };
