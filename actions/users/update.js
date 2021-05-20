const models = require("../../models");

const { User } = models;

const update = async (id, body) => User.update(body, { where: { id } });

module.exports = {
  update,
};
