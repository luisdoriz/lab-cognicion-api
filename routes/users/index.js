const express = require('express');

const auth = require('../../middleware/auth');
const UserController = require('../../controllers/users');

const users = express.Router();
// Get
users.get('/', auth.valid, UserController.getUser);

// Post
users.post('/', UserController.postUser);
users.post('/login', UserController.logIn);

module.exports = users;