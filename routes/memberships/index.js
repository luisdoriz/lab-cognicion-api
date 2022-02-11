const express = require("express");
const auth = require("../../middleware/auth");
const MembershipsController = require("../../controllers/memberships");

const memberships = express.Router();

// GET
memberships.get("/", auth.valid, MembershipsController.getMemberships);
memberships.get(
  "/:idMembership",
  auth.valid,
  MembershipsController.getSingleMembership
);

// PUT
memberships.put("/:id", auth.valid, MembershipsController.updateMembership);

// POST
memberships.post("/", auth.valid, MembershipsController.postMembership);

// POST
memberships.delete(
  "/:idMembership",
  auth.valid,
  MembershipsController.deleteMembership
);

module.exports = memberships;
