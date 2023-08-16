const express = require("express");
const UserController = require("../controllers/users");
const { userAuth } = require("../middleware/user");
const { token, fbAuth } = require("../middleware/auth");

const users = express.Router();
// Get
users.get("/", [token, fbAuth, userAuth], UserController.getUser);
users.get("/all", [token, fbAuth, userAuth], UserController.getAllUsers);

// Post
users.post("/", UserController.postUser);
users.post("/login", UserController.logIn);

// Put
users.put("/", [token, fbAuth, userAuth], UserController.editUser);

// Delete
users.delete("/:id", [token, fbAuth, userAuth], UserController.deleteUser);

module.exports = users;
