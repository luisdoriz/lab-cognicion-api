"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.UserType, {
        foreignKey: "idUserType",
      });
      this.hasMany(models.Test, {
        as: "tests",
        foreignKey: "idUser",
      });
      this.hasMany(models.Payment, {
        as: "payments",
        foreignKey: "idUser",
      });
      this.hasMany(models.Patient, {
        as: "patients",
        foreignKey: "idUser",
      });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profession: DataTypes.STRING,
      uid: DataTypes.STRING,
      institution: DataTypes.STRING,
      birthDate: DataTypes.DATE,
      country: DataTypes.STRING,
      scholarship: DataTypes.STRING,
      token: DataTypes.STRING,
      stripe_id: DataTypes.STRING,
      idUserType: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      paranoid: true,
    }
  );
  return User;
};
