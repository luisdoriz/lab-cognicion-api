const axios = require('axios')
const responses = require('../constants/responses');

exports.postUser = async (req, res) => {
    const { body } = req;
    try {
        testApiUrl = process.env.TESTS_API
        request = await axios.post(`${testApiUrl}/results`, body)
        res.status(200).json(request.data);
    } catch (error) {
        res.status(400).json({ status: responses.INTERNAL_ERROR, error });
    }
};