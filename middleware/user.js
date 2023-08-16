const { USER_NOT_FOUND } = require("../constants");
const { User } = require("../models");

const userAuth = async (req, res, next) => {
  try {
    const { uid } = req;
    let current_user = await User.findOne({
      where: {
        uid,
      },
    });
    if (current_user === null) {
      return res.status(404).send({
        code: 404,
        status: "failed",
        message: USER_NOT_FOUND,
      });
    }
    current_user = current_user.toJSON();
    req.idUser = current_user.id;
    req.user = current_user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { userAuth };
