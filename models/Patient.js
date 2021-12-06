"use strict";

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "Patient",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthDate: DataTypes.DATE,
      gender: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      dominantHand: DataTypes.STRING,
      antecedent: DataTypes.STRING,
      drugsConsumption: DataTypes.BOOLEAN,
      drugsTreatment: DataTypes.BOOLEAN,
      whichDrugs: DataTypes.STRING,
      dose: DataTypes.STRING,
      deletedAt: DataTypes.DATE,
    },
    {}
  );

  Patient.associate = function (models) {
    Patient.belongsTo(models.User, {
      as: "user",
      foreignKey: "idUser",
    });
    Patient.hasMany(models.Damage, { foreignKey: "idPatient", as: "damages" });
  };

  return Patient;
};
