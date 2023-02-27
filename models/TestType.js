"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TestType = sequelize.define(
    "TestType",
    {
      name: DataTypes.STRING,
      handle: DataTypes.STRING,
      author: DataTypes.STRING,
    },
    {}
  );

  TestType.associate = function (models) {
    TestType.hasMany(models.Test, {
      as: "tests",
      foreignKey: "type",
    });
    TestType.belongsTo(models.File, {
      as: "thumbnail",
      foreignKey: "idFile",
    });
  };
  return TestType;
};
