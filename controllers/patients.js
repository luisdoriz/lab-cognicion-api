const {
  findPatientsByQuery,
  createPatient,
  updatePatient,
  deletePatient,
  findPatientByQuery,
} = require("../actions/patients");
const responses = require("../constants/responses");

exports.getPatientById = async (req, res) => {
  const { params, body, query } = req;
  const { id: idUser, isAdmin } = body.user;
  const { id } = params;
  const { admin = false } = query;
  try {
    const query = {
      id,
    };
    if (!isAdmin || !admin) {
      query.idUser = idUser;
    }
    const patient = await findPatientByQuery(query);
    if (patient === null) return res.sendStatus(404);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data: patient });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getPatients = async (req, res) => {
  const { body, query } = req;
  const { admin = false } = query;
  const { id: idUser, isAdmin } = body.user;
  try {
    let query;
    if (!isAdmin || !admin) {
      query = {
        idUser,
      };
    } else {
      query = {};
    }
    const patients = await findPatientsByQuery(query);
    if (patients.length > 0) {
      res
        .status(200)
        .json({ status: responses.SUCCESS_STATUS, data: patients });
    } else {
      res.status(400).json({ status: responses.NOT_FOUND, data: [] });
    }
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postPatient = async (req, res) => {
  const { body } = req;
  const { id: idUser } = body.user;
  try {
    body.idUser = idUser;
    const data = await createPatient(body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.putPatient = async (req, res) => {
  const { id: idUser } = req.body.user;
  const { id } = req.params;
  delete req.body.user;
  const body = { ...req.body };
  const ids = {
    idUser,
    id,
  };
  try {
    const data = await updatePatient(ids, body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  const { id: idUser } = req.body.user;
  try {
    const data = await deletePatient(id, idUser);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};
