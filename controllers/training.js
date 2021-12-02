const axios = require("axios");
const { getAllEstimulos } = require("../playground");
const flaskApiUrl = "http://localhost:5000";

const getParams = async (req, res, next) => {
  try {
    const { method } = req.query;
    if (!method) return res.sendStatus(400);
    const estimulos = await getAllEstimulos();
    const index = estimulos
      .map(({ index }) => index)
      .filter((value) => !isNaN(value));
    const reaction = estimulos
      .map(({ reaccion }) => reaccion)
      .filter((value) => !isNaN(value));
    const correct = estimulos.map(({ correct }) => (correct ? 1 : 0));
    const error = estimulos.map(({ error }) => (error === false ? 0 : error));
    const response = await axios.post(`${flaskApiUrl}/${method}`, {
      index,
      reaction,
      correct,
      error,
    });
    const params = response.data;
    res.status(200).send(params);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

module.exports = { getParams };
