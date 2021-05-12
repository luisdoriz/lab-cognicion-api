const { AccessUrl } = require('../../models');

const createAccessUrl = async () =>  {
  accessUrl = await AccessUrl.create();
  await accessUrl.update({token : "token-test"});
  return accessUrl
};



module.exports = {
    createAccessUrl,
  };
