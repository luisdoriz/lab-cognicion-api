const { findPatientsByQuery } = require("../actions/patients/read");
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
    const patients = await findPatientsByQuery(query);
    if (patients.length > 0) {
      patient = patients[0];
      res.status(200).json({ status: responses.SUCCESS_STATUS, data: patient });
    } else {
      res.status(400).json({ status: responses.NOT_FOUND, data: [] });
    }
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
