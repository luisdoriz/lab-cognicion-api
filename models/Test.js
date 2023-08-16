"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    "Test",
    {
      name: DataTypes.STRING,
      idAccessUrl: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      idPatient: DataTypes.INTEGER,
      order: DataTypes.INTEGER,
      completedAt: DataTypes.DATE,
    },
    {
      paranoid: true,
    }
  );

  Test.associate = function (models) {
    Test.belongsTo(models.User, {
      as: "user",
      foreignKey: "idUser",
    });
    Test.belongsTo(models.AccessUrl, {
      as: "accessUrl",
      foreignKey: "idAccessUrl",
    });
    Test.belongsTo(models.TestType, {
      as: "testType",
      foreignKey: "type",
    });
    Test.belongsTo(models.Patient, {
      as: "patient",
      foreignKey: "idPatient",
    });
  };
  return Test;
};
