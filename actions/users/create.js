const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jwt-simple');

const { User } = require('../../models');
const { getUserByEmail } = require('./read');

const tokenSecret = 'lab-cognicion';

const createUser = async (body) =>  User.create(body);

const createToken = async (user) => {
  const {
    id,
    name,
    email,
  } = user;
  const expires = moment().add(3, 'months').valueOf();
  const token = jwt.encode({
    id,
    email,
    name,
    exp: expires,
  }, tokenSecret);
  await user.update({ token });
  return token;
};

const verifyPassword = (password, user) => bcrypt
  .compare(password, user.password).then(async (result) => {
    if (result) {
      const token = await createToken(user);
      return token;
    }
    throw new Error('No Match');
  });

const login = async (body) => {
  const { email, password } = body;
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('No user found');
  }
  return verifyPassword(password, user);
};

module.exports = {
  createUser,
  login,
};