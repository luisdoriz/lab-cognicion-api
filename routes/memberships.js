const express = require("express");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");
const MembershipsController = require("../controllers/memberships");

const memberships = express.Router();

// GET
memberships.get(
  "/",
  [token, fbAuth, userAuth],
  MembershipsController.getMemberships
);
memberships.get(
  "/:idMembership",
  [token, fbAuth, userAuth],
  MembershipsController.getSingleMembership
);

// PUT
memberships.put(
  "/:id",
  [token, fbAuth, userAuth],
  MembershipsController.updateMembership
);

// POST
memberships.post(
  "/",
  [token, fbAuth, userAuth],
  MembershipsController.postMembership
);

// POST
memberships.delete(
  "/:idMembership",
  [token, fbAuth, userAuth],
  MembershipsController.deleteMembership
);

module.exports = memberships;
