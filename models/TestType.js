"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const TestType = sequelize.define(
    "TestType",
    {
      name: DataTypes.STRING,
      handle: DataTypes.STRING,
    },
    {}
  );

  TestType.associate = function (models) {
    TestType.hasMany(models.Test, {
      as: "tests",
      foreignKey: "type",
    });
  };
  return TestType;
};
