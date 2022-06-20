"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Survey = sequelize.define(
    "Survey",
    {
      idAccessUrl: DataTypes.INTEGER,
      idUser: DataTypes.INTEGER,
      type: DataTypes.INTEGER,
      name: DataTypes.STRING,
      lastName: DataTypes.STRING,
      relationship: DataTypes.STRING,
      idPatient: DataTypes.INTEGER,
      idMultiTest: DataTypes.INTEGER,
    },
    {}
  );

  Survey.associate = function (models) {
    Survey.belongsTo(models.User, {
      as: "user",
      foreignKey: "idUser",
    });
    Survey.belongsTo(models.AccessUrl, {
      as: "accessUrl",
      foreignKey: "idAccessUrl",
    });
    Survey.belongsTo(models.SurveyType, {
      as: "surveyType",
      foreignKey: "type",
    });
    Survey.belongsTo(models.Patient, {
      as: "patient",
      foreignKey: "idPatient",
    });
    Survey.belongsTo(models.MultiTest, {
      as: "multitest",
      foreignKey: "idMultiTest",
    });
  };
  return Survey;
};
