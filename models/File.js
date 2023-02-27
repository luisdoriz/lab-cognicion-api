"use strict";

module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("File", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
  });

  return File;
};
