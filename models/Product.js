"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      order: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
    },
    {}
  );

  Payment.associate = function (models) {
    Payment.belongsTo(models.User, {
      as: "user",
      foreignKey: "idUser",
    });
  };

  return Payment;
};
