"use strict";

module.exports = (sequelize, DataTypes) => {
  const Damage = sequelize.define(
    "Damage",
    {
      damageLocation: DataTypes.STRING,
    },
    {}
  );

  Damage.associate = function (models) {
    Damage.belongsTo(models.User, {
      foreignKey: "idUser",
      as: "damages",
    });
  };

  return Damage;
};
