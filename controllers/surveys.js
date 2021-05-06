const axios = require('axios');
const responses = require('../constants/responses');


exports.postSurveyAnswer = async (req, res) => {
    const { body } = req;
    try {
        const testApiUrl = process.env.TESTS_API
        const new_body = body
        new_body.idUser = new_body.user.id
        delete new_body.user;
        const request = await axios.post(`${testApiUrl}/surveys`, new_body)
        res.status(200).json(request.data);
    } catch (error) {
        console.log("Error: ", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.getSurveys = async (req, res) => {
    const { query, body } = req;
    const { id: idUser } = body.user;
    query.idUser = idUser;
    console.log(query)
    try {
        const testApiUrl = process.env.TESTS_API
        const request = await axios.get(`${testApiUrl}/surveys`, { params: query })
        res.status(200).json(request.data);
    } catch (error) {
        console.log("Error", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.getSurvey = async (req, res) => {
    const { params, body } = req;
    const { id: idUser } = body.user;
    const { id: _id } = params;
    try {
        const testApiUrl = process.env.TESTS_API
        query = {
            idUser,
            _id,
        }
        const request = await axios.get(`${testApiUrl}/surveys`, { params: query })
        let { data } = request.data

        if (data.length > 0) {
            data = data[0]
            res.status(200).json({ data });
        } else {
            res.status(404).json({ status: responses.NOT_FOUND, error: "Survey not found" });
        }
    } catch (error) {
        console.log("Error", error)
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
}
