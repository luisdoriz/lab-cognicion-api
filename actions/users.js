const models = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const moment = require("moment");

const tokenSecret = "lab-cognicion";

const { User } = models;

const getUsers = async () => User.findAll();

const userEmailExists = async (email) => User.count({ where: { email } });

const getUserByEmail = async (email) =>
  User.findOne({
    where: {
      email,
    },
  });

const createUser = async (body) => User.create(body);

const createToken = async (user) => {
  const { id, name, email } = user;
  const expires = moment().add(3, "months").valueOf();
  const token = jwt.encode(
    {
      id,
      email,
      name,
      exp: expires,
    },
    tokenSecret
  );
  await user.update({ token });
  return token;
};

const verifyPassword = (password, user) =>
  bcrypt.compare(password, user.password).then(async (result) => {
    if (result) {
      const token = await createToken(user);
      return token;
    }
    throw new Error("No Match");
  });

const login = async (body) => {
  const { email, password } = body;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("No user found");
  }
  return verifyPassword(password, user);
};

const updateUser = async (id, body) => User.update(body, { where: { id } });

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
  login,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserByEmail,
  userEmailExists,
};
