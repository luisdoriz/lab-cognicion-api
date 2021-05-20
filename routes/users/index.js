const express = require("express");

const auth = require("../../middleware/auth");
const UserController = require("../../controllers/users");

const users = express.Router();
// Get
users.get("/", auth.valid, UserController.getUser);
users.get("/all", auth.valid, UserController.getAllUsers);

// Post
users.post("/", UserController.postUser);
users.post("/login", UserController.logIn);

// Put
users.put("/", auth.valid, UserController.editUser);

// Delete
users.delete("/:id", auth.valid, UserController.deleteUser);

module.exports = users;
