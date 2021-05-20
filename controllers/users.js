const Users = require("../actions/users");
const responses = require("../constants/responses");

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
      res.status(409).json({
        status: responses.ERROR_STATUS,
        message: "There is already an account with that email provided.",
      });
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
    res.status(400).json({
      status: responses.ERROR_STATUS,
      error: "Revisa la direccion del correo o la contraseña.",
    });
  }
};

exports.getUser = async (req, res) => {
  res
    .status(200)
    .json({ status: responses.SUCCESS_STATUS, data: req.body.user });
};

exports.getAllUsers = async (req, res) => {
  const { isAdmin } = req.body.user;
  try {
    if (isAdmin) {
      const data = await Users.getUsers();
      res.status(200).json({ status: responses.SUCCESS_STATUS, data });
    } else {
      res.status(400).json({
        status: responses.ERROR_STATUS,
        error: "No cuenta con permisos para traer a todos los usuarios.",
      });
    }
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.body.user;
  delete req.body.user;
  const body = { ...req.body };
  try {
    const data = await Users.update(id, body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { isAdmin } = req.body.user;
  const { id } = req.params;
  try {
    if (isAdmin) {
      const data = await Users.deleteUser(id);
      res.status(200).json({ status: responses.SUCCESS_STATUS, data });
    } else {
      res.status(400).json({
        status: responses.ERROR_STATUS,
        error: "No cuenta con permisos para eliminar al usuario.",
      });
    }
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};
