"use strict";

module.exports = (sequelize, DataTypes) => {
  const Membership = sequelize.define(
    "Membership",
    {
      deletedAt: DataTypes.DATE,
      name: DataTypes.STRING,
      price: DataTypes.DECIMAL,
      price_id: DataTypes.STRING,
      product_id: DataTypes.STRING,
      test_amount: DataTypes.INTEGER,
      expiration_days: DataTypes.INTEGER,
    },
    {}
  );

  return Membership;
};
