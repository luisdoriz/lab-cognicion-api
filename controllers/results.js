const axios = require('axios');
const { createTest } = require('../actions/tests/create');
const { getUserTests } = require('../actions/tests/read');
const responses = require('../constants/responses');

exports.postResult = async (req, res) => {
    const { body } = req;
    try {
        const testApiUrl = process.env.TESTS_API
        const user_test = await createTest(body)
        const new_body = body
        new_body.idPrueba = user_test.id
        delete new_body.user;
        const request = await axios.post(`${testApiUrl}/results`, new_body)
        res.status(200).json(user_test);
        // res.status(200).json(request.data);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
};

exports.getResults = async (req, res) => {
    const { params, body } = req;
    const { id: idUser } = body.user;
    params.profesional = idUser;
    try {
        const tests = await getUserTests(idUser);
        const testApiUrl = process.env.TESTS_API;
        const request = await axios.get(`${testApiUrl}/results`, params)
        const { data } = request.data
        let merged = []
        for (let i = 0; i < data.length; i++) {
            merged.push({
                ...data[i],
                ...(tests.find(({dataValues: itmInner}) => itmInner.id === data[i].idPrueba).dataValues)
            }
            );
        }

        res.status(200).json(merged);
    } catch (error) {
        console.log("Error", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}