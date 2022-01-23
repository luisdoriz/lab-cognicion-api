const { TestType } = require("../models");

const getTestTypes = async (req, res, next) => {
  try {
    const testTypes = await TestType.findAll();
    res.status(200).send({ testTypes });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
};

module.exports = { getTestTypes };
