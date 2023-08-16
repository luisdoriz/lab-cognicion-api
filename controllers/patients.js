const {
  findPatientsByQuery,
  createPatient,
  updatePatient,
  deletePatient,
  findPatientByQuery,
  pacienteExiste,
} = require("../actions/patients");
const responses = require("../constants/responses");
const { getAllResultsPaciente } = require("../functions/training");

exports.getPatientById = async (req, res) => {
  const { params, body, query } = req;
  const { id: idUser, isAdmin } = req.user;
  const { id } = params;
  const { admin = false } = query;
  try {
    const query = {
      id,
    };
    if (!isAdmin || !admin) {
      query.idUser = idUser;
    }
    let patient = await findPatientByQuery(query);
    patient = patient.toJSON();
    const results = await getAllResultsPaciente(id);
    patient.results = results;
    if (patient === null) return res.sendStatus(404);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data: patient });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getPatientByEmail = async (req, res) => {
  try {
    let email = req.query.email;
    let idUser = req.query.idUser;
    let patient = await findPatientsByQuery({ email, idUser });
    if (patient.length === 0) {
      return res.sendStatus(404);
    }
    patient = patient[0];
    res
      .status(200)
      .json({ status: responses.SUCCESS_STATUS, data: { patient } });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.getPatients = async (req, res) => {
  const { query } = req;
  const { admin = false } = query;
  const { id: idUser, isAdmin } = req.user;
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
    res.status(200).json({ status: responses.SUCCESS_STATUS, data: patients });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.postPatient = async (req, res) => {
  const { body } = req;
  let idUser;
  if (req.user) {
    idUser = req.user.id;
  }
  if (!idUser) {
    idUser = body.idUser;
  }
  delete body.id;
  try {
    body.idUser = idUser;
    if (body.email && body.email !== "") {
      const existe = await pacienteExiste(idUser, body.email);
      if (existe && existe !== null) {
        return res.status(409).send({ data: { paciente: existe } });
      }
    }
    const data = await createPatient(body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ status: responses.INTERNAL_ERROR, error });
  }
};

exports.putPatient = async (req, res) => {
  let idUser;
  if (req.user) {
    idUser = req.user;
  } else if (req.body.idUser) {
    idUser = req.body.idUser;
  }
  const { id } = req.params;
  delete req.user;
  const body = { ...req.body };
  const ids = {
    idUser,
    id,
  };
  try {
    const data = await updatePatient(ids, body);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};

exports.deletePatient = async (req, res) => {
  const { id } = req.params;
  const { id: idUser } = req.user;
  try {
    const data = await deletePatient(id, idUser);
    res.status(200).json({ status: responses.SUCCESS_STATUS, data });
  } catch (error) {
    res.status(500).json({
      status: responses.ERROR_STATUS,
      error: "Internal Error.",
    });
  }
};
