module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('Tests', 'type', {
              type: Sequelize.INTEGER,
              references: {
                model: {
                  tableName: 'TestTypes',
                },
                key: 'id'
              },
              allowNull: false
          })
      ])
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.changeColumn('Tests', 'type', {
              type: Sequelize.INTEGER,
              allowNull: true,
          })
      ])
  }
};

