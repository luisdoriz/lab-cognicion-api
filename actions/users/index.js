const  READ = require('./read');
const  CREATE = require('./create');

module.exports = {
  ...READ,
  ...CREATE,
};
