'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define('Test', {
    name: DataTypes.STRING,
    idAccessUrl: DataTypes.INTEGER,
    idUser: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {});

  Test.associate = function (models) {
    Test.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'idUser',
    });
    Test.belongsTo(models.AccessUrl, {
      as: 'accessUrl',
      foreignKey: 'idAccessUrl',
    });
  };
  return Test;
};