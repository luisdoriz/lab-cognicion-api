const admin = require("firebase-admin");

const fbAuth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decodedToken = await admin.auth().verifyIdToken(token);
      if (decodedToken) {
        req.uid = decodedToken.uid;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

const token = async (req, res, next) => {
  if (req.headers.authorization) {
    next();
  } else {
    return res
      .status(400)
      .send({ code: 400, status: "failed", message: "Missing auth token" });
  }
};

module.exports = {
  token,
  fbAuth,
};
