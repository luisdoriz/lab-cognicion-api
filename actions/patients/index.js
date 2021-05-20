const READ = require("./read");
const CREATE = require("./create");
const UPDATE = require("./update");

module.exports = {
  ...READ,
  ...CREATE,
  ...UPDATE,
};
