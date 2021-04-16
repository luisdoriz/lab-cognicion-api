const axios = require('axios');
const { createTest } = require('../actions/tests/create');
const { getUserTests, getUserTest } = require('../actions/tests/read');
const responses = require('../constants/responses');


exports.createTest = async (req, res) => {
    const { body } = req;
    try {
        const testApiUrl = process.env.TESTS_API
        const new_body = body
        new_body.idUser = new_body.user.id
        delete new_body.user;
        const user_test = await createTest(new_body)
        new_body.idTest = user_test.id
        const request = await axios.post(`${testApiUrl}/settings`, new_body)
        res.status(200).json({ data: user_test });
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.postResult = async (req, res) => {
    const { body } = req;
    try {
        const testApiUrl = process.env.TESTS_API
        const new_body = body
        new_body.idUser = new_body.user.id
        delete new_body.user;
        const request = await axios.post(`${testApiUrl}/results`, new_body)
        res.status(200).json(request.data);
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
        res.status(200).json({ data: tests });
    } catch (error) {
        console.log("Error", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.getResult = async (req, res) => {
    const { params, body } = req;
    const { id: idTest } = params;
    try {
        const test = await getUserTest(idTest);
        const testApiUrl = process.env.TESTS_API;
        url = `${testApiUrl}/results?idTest=${idTest}`
        const request = await axios.get(url)
        const { data } = request.data
        let results = {}
        if (data.length > 0) {
            results = data[0]
        }
        res.status(200).json({ data: { test, results } });
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.getFiabilityTest = async (req, res) => {
      try {
        const testApiUrl = process.env.TESTS_API;
        url = `${testApiUrl}/results/fiability`
        const request = await axios.get(url)
        const { data } = request.data
        res.status(200).json({ data });
    } catch (error) {
        console.log("Error", error)
        res.status(500).json({ status: responses.INTERNAL_ERROR, error });
    }
}
