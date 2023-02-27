"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const SurveyType = sequelize.define(
    "SurveyType",
    {
      name: DataTypes.STRING,
      author: DataTypes.STRING,
    },
    {}
  );

  SurveyType.associate = function (models) {
    SurveyType.hasMany(models.Survey, {
      as: "surveys",
      foreignKey: "type",
    });
    SurveyType.belongsTo(models.File, {
      as: "thumbnail",
      foreignKey: "idFile",
    });
  };

  return SurveyType;
};
