"use strict";

module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      order: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      deletedAt: DataTypes.DATE,
      status: DataTypes.STRING,
      test_amount: DataTypes.INTEGER,
      expiration_date: DataTypes.DATE,
      subscription_id: DataTypes.STRING,
    },
    {}
  );

  Payment.associate = function (models) {
    Payment.belongsTo(models.Payment, {
      as: "membership",
      foreignKey: "idMembership",
    });
    Payment.belongsTo(models.User, {
      as: "user",
      foreignKey: "idUser",
    });
  };

  return Payment;
};
