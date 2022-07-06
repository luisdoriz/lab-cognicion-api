"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MultiTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Test, {
        as: "tests",
        foreignKey: "idMultiTest",
      });
      this.hasMany(models.Survey, {
        as: "surveys",
        foreignKey: "idMultiTest",
      });
      this.belongsTo(models.User, {
        as: "user",
        foreignKey: "idUser",
      });
    }
  }
  MultiTest.init(
    {
      idMultiTest: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MultiTest",
      tableName: "MultiTests",
      paranoid: true,
    }
  );
  return MultiTest;
};
