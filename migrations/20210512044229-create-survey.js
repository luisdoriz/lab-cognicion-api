'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Surveys', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idAccessUrl: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'AccessUrls',
          },
          key: 'id'
        },
        allowNull: false
      },
      idUser: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id'
        },
        allowNull: false
      },
      idPatient: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Patients',
          },
          key: 'id'
        },
        allowNull: false
      },
      type: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'SurveyTypes',
          },
          key: 'id'
        },
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Surveys');
  }
};