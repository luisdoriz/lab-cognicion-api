const Users = require("../actions/users");
const responses = require("../constants/responses");

exports.postUser = async (req, res) => {
  try {
    const data = req.body;
    const emailExists = await Users.userEmailExists(data.email);
    if (emailExists) {
      res.status(409).json({
        status: responses.ERROR_STATUS,
        message: "There is already an account with that email provided.",
      });
    } else {
      const user = await Users.createUser(data);
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
  res.status(200).json({ status: responses.SUCCESS_STATUS, user: req.user });
};

exports.getAllUsers = async (req, res) => {
  const { isAdmin } = req.user;
  try {
    if (isAdmin) {
      const users = await Users.getUsers();
      res.status(200).json({ status: responses.SUCCESS_STATUS, users });
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
  const { id } = req.user;
  delete req.user;
  const body = { ...req.body };
  try {
    await Users.update(id, body);
    res.status(200).json({ status: responses.SUCCESS_STATUS });
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;
  try {
    if (isAdmin) {
      await Users.deleteUser(id);
      res.status(200).json({ status: responses.SUCCESS_STATUS });
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
