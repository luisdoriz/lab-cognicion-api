const axios = require("axios");
const { getAllEstimulos, calculateFeatures } = require("../functions/training");
const flaskApiUrl = process.env.FLASK_API_URL;
const { labels } = require("../constants/utils");
const models = require("../models");

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
    const promises = [];
    Object.keys(features).forEach((key, index) => {
      const current = features[key];
      const { weights } = current;
      promises.push(
        models.Feature.create({
          w0: weights[0],
          w1: weights[1],
          w2: weights[2],
          w3: weights[3],
          w4: weights[4],
          b: weights[5],
          feature: key,
          feature_number: labels.indexOf(key) + 1,
        })
      );
    });
    await Promise.all(promises);
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
