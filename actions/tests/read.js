const models = require('../../models');

const { Test, AccessUrl } = models;

const getTestByQuery = async (query) => Test.findAll({
    where: query,
    includes: [{
        Model: "AccessUrl",
        as: "accessUrl"
    }]
});

const getUserTests = async (idUser) => {
    const results = await getTestByQuery({ idUser });
    console.log(results)
    return results
}

module.exports = {
    getTestByQuery,
    getUserTests,
};
