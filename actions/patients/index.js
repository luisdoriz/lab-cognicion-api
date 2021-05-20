const READ = require("./read");
const CREATE = require("./create");
const UPDATE = require("./update");
const DELETE = require("./delete");

module.exports = {
  ...READ,
  ...CREATE,
  ...UPDATE,
  ...DELETE,
};
