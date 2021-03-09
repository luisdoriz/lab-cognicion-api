module.exports = {
  up: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.addColumn('Tests', 'idPatient', {
              type: Sequelize.INTEGER,
              references: {
                model: {
                  tableName: 'Patients',
                },
                key: 'id'
              },
              allowNull: false
          })
      ])
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.removeColumn('Tests', 'idPatient')
      ])
  }
};

