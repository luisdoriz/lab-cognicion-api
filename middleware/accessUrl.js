const { AccessUrl, Survey, Test } = require("../models");
const { fbAuth } = require("./auth");

const validAccessUrlOrFirebase = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let current_access_token = await AccessUrl.findOne({
      where: {
        token,
      },
      include: [
        {
          model: Test,
          as: "test",
          required: false,
        },
        {
          model: Survey,
          as: "survey",
          required: false,
        },
      ],
    });
    if (current_access_token === null) {
      return fbAuth(req, res, next);
    }
    current_access_token = current_access_token.toJSON();
    req.idAccessUrl = current_access_token.id;
    next();
  } catch (error) {
    next(error);
  }
};

const validAccessUrl = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let current_access_token = await AccessUrl.findOne({
      where: {
        token,
      },
      include: [
        {
          model: Test,
          as: "test",
          required: false,
        },
        {
          model: Survey,
          as: "survey",
          required: false,
        },
      ],
    });
    if (current_access_token === null) {
      return res.sendStatus(401);
    }
    current_access_token = current_access_token.toJSON();
    req.idAccessUrl = current_access_token.id;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { validAccessUrl, validAccessUrlOrFirebase };
