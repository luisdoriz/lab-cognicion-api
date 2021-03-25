const { findPatientByQuery } = require('../actions/patients/read');
const responses = require('../constants/responses');


exports.getPatientById = async (req, res) => {
    const { params, body } = req;
    const { id: idUser } = body.user;
    const { id } = params;
    try {
        const query = {
            idUser,
            id,
        };
        const patients = await findPatientByQuery(query);
        if (patients.length > 0) {
            patient = patients[0]
            res.status(200).json({ status: responses.SUCCESS_STATUS, data: patient });
        } else {
            res.status(400).json({ status: responses.NOT_FOUND, data: [] });
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json({ status: responses.INTERNAL_ERROR, error });
    }
}

exports.getPatients = async (req, res) => {
    const { body } = req;
    const { id: idUser } = body.user;
    try {
        const query = {
            idUser,
        };
        const patients = await findPatientByQuery(query);
        if (patients.length > 0) {
            res.status(200).json({ status: responses.SUCCESS_STATUS, data: patients });
        } else {
            res.status(400).json({ status: responses.NOT_FOUND, data: [] });
        }
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).json({ status: responses.INTERNAL_ERROR, error });
    }
}