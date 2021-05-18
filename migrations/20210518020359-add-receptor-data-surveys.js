module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Surveys", "name", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Surveys", "lastName", {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn("Surveys", "relationship", {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Surveys", "name"),
      queryInterface.removeColumn("Surveys", "lastName"),
      queryInterface.removeColumn("Surveys", "relationship"),
    ]);
  },
};
