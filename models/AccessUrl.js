'use strict';
const moment = require('moment');
const jwt = require('jwt-simple');
const tokenSecret = 'lab-cognicion';

module.exports = (sequelize, DataTypes) => {
  const AccessUrl = sequelize.define('AccessUrl', {
    token: DataTypes.STRING,
    url: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    expirationDate: DataTypes.DATE
  }, {});

  AccessUrl.beforeCreate(async (model) => {
    const expires = moment().add(3, 'months').valueOf();
    const token = jwt.encode({
      idAccessUrl: model.id,
      exp: expires,
    }, tokenSecret);
    model.token = token;
    model.expirationDate= expires
    return model
  });
  AccessUrl.beforeUpdate(async (model) => {
    const expires = moment().add(3, 'months').valueOf();
    const token = jwt.encode({
      idAccessUrl: model.id,
      exp: expires,
    }, tokenSecret);
    model.token = token;
    model.expirationDate= expires
    return model
  });

  return AccessUrl;
};
