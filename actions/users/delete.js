const models = require("../../models");

const { User } = models;

const deleteUser = async (id) =>
  User.update(
    {
      deletedAt: new Date(),
    },
    {
      where: {
        id,
        deletedAt: null,
      },
    }
  );

module.exports = {
  deleteUser,
};
