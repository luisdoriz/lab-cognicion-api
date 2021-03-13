module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('Tests', 'type', {
            type: 'INTEGER USING CAST("type" as INTEGER)'
          })
      ])
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('Tests', 'type', {
              type: Sequelize.STRING,
              allowNull: true,
          })
      ])
  }
};
