'use strict';

module.exports = (sequelize, DataTypes) => {
  const AccessUrl = sequelize.define('AccessUrl', {
    token: DataTypes.STRING,
    url: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    expirationDate: DataTypes.DATE
  }, {});

  return AccessUrl;
};
