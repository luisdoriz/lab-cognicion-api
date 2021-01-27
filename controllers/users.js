const Users = require('../actions/users');
const responses = require('../constants/responses');

exports.postUser = async (req, res) => {
  const {
    name,
    profession,
    email,
    password,
    institution,
    birthDate,
    country,
    scholarship,
    logo,
  } = req.body;
  const body = {
    name,
    profession,
    email,
    password,
    institution,
    birthDate,
    country,
    scholarship,
    logo,
  };
  try {
    const emailExists = await Users.userEmailExists(email);
    if (emailExists) {
      res.status(409).json({ status: responses.ERROR_STATUS, message: 'There is already an account with that email provided.' });
    } else {
      const user = await Users.createUser(body);
      res.status(201).json({ status: responses.SUCCESS_STATUS, data: user });
    }
  } catch (error) {
    res.status(400).json({ status: responses.ERROR_STATUS, error });
  }
};

exports.logIn = async (req, res) => {
  const { email, password } = req.body;
  const body = { email, password };
  try {
    const token = await Users.login(body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data: { token } });
  } catch {
    res.status(400).json({ status: responses.ERROR_STATUS, error: 'Check the email address or password.' });
  }
};

exports.getUser = async (req, res) => {
  res.status(200).json({ status: responses.SUCCESS_STATUS, data: req.body.user });
};