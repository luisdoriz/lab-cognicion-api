const jwt = require("jwt-simple");

const { User, Test, Payment } = require("../models");

const tokenSecret = "lab-cognicion";

/**
 * @param {JSON - Authorization} req
 * @param {JSON} res
 * @param {Function} next
 */
exports.valid = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization !== "undefined" &&
    req.headers.authorization.length > 0
  ) {
    try {
      const decoded = jwt.decode(req.headers.authorization, tokenSecret);
      if ("idAccessUrl" in decoded) {
        req.body.idAccessUrl = decoded.idAccessUrl;
        next();
      } else {
        User.findOne({
          where: {
            id: decoded.id,
            token: req.headers.authorization,
          },
          include: [
            { model: Test, required: false, as: "tests" },
            { model: Payment, required: false, as: "payments" },
          ],
        })
          .then((user) => {
            if (user.id) {
              req.body.user = user;
              next();
            } else {
              res.status(401).json({
                status: "error",
                message: "Unauthorized",
              });
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(401).json({
              status: "error",
              message: "Unauthorized",
              error: err,
            });
          });
      }
    } catch (e) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401).json({
      status: "error",
      data: null,
      message: "Unauthorized",
      error: "No token provided",
    });
  }
};
