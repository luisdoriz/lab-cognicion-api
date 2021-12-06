const axios = require("axios");
const {
  getAllEstimulos,
  calculateFeatures,
  loadFeatures,
} = require("../functions/training");
const flaskApiUrl = "http://67.205.147.30:5000";

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

const calculateParams = async (req, res, next) => {
  try {
    const { method } = req.query;
    const features = await calculateFeatures(method);
    await loadFeatures(features);
    res.status(200).send({ features });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

module.exports = {
  getParams,
  calculateParams,
  calculateFeatures,
};
