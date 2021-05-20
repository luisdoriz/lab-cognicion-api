'use strict';
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profession: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institution: DataTypes.STRING,
    birthDate: DataTypes.DATE,
    country: DataTypes.STRING,
    scholarship: DataTypes.STRING,
    logo: DataTypes.STRING,
    token: DataTypes.STRING,
    isAdmin: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    deletedAt: DataTypes.DATE
  }, {
    paranoid: true,
  });
  User.associate = function (models) {
    User.hasMany(models.Test, {
      as: 'tests',
      foreignKey: 'idUser',
    });
    User.hasMany(models.Patient, {
      as: 'patients',
      foreignKey: 'idUser',
    });
  };
  User.beforeCreate(async (model) => {
    const hash = await bcrypt.hash(model.password, 10);
    model.password = hash;
  });
  User.beforeUpdate(async (model) => {
    if (model.changed('password')) {
      const hash = await bcrypt.hash(model.password, 10);
      model.password = hash;
    }
    return model;
  });
  return User;
};
