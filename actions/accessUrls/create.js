const { AccessUrl } = require('../../models');

const createAccessUrl = async () =>  AccessUrl.create();


module.exports = {
    createAccessUrl,
  };
