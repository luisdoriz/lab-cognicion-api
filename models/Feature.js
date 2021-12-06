"use strict";

module.exports = (sequelize, DataTypes) => {
  const Feature = sequelize.define(
    "Feature",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      feature: DataTypes.STRING,
      w0: DataTypes.STRING,
      w1: DataTypes.STRING,
      w2: DataTypes.STRING,
      w3: DataTypes.STRING,
      w4: DataTypes.STRING,
      b: DataTypes.STRING,
      feature_number: DataTypes.INTEGER,
      patients: DataTypes.INTEGER,
    },
    {}
  );

  Feature.beforeCreate(async (model) => {
    console.log(model.id);
    return model;
  });

  return Feature;
};
