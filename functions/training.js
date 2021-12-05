const { getNechapiFeature } = require("../functions/tests");
const { Feature, Sequelize } = require("../models");

const getFeatures = async () => {
  let features = await Feature.findAll({
    order: [Sequelize.col("feature_number"), Sequelize.col("created_at")],
  });
  features = features.map((feature) => feature.toJSON());
  let result = {};
  const numbers = [1, 2, 3, 4, 5];
  const labels = [
    "anger",
    "sensation",
    "emotional",
    "sociability",
    "motivation",
  ];
  numbers.forEach((number) => {
    const current = features.find(
      (feature) => feature.feature_number === number
    );
    const weights = [
      parseFloat(current.w0),
      parseFloat(current.w1),
      parseFloat(current.w2),
      parseFloat(current.w3),
      parseFloat(current.w4),
      parseFloat(current.b),
    ];
    result[labels[number - 1]] = { weights };
  });
  return result;
};

const getNechapiPrediction = (estimulos, features) => {
  const anger = getNechapiFeature(features.anger, estimulos);
  const sensation = getNechapiFeature(features.sensation, estimulos);
  const emotional = getNechapiFeature(features.emotional, estimulos);
  const sociability = getNechapiFeature(features.sociability, estimulos);
  const motivation = getNechapiFeature(features.motivation, estimulos);
  return { anger, sensation, emotional, sociability, motivation };
};

module.exports = { getNechapiPrediction, getFeatures };
