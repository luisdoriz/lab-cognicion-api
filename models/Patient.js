"use strict";

module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define(
    "Patient",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthDate: DataTypes.DATE,
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      idUser: DataTypes.INTEGER,
      dominantHand: DataTypes.STRING,
      antecedent: DataTypes.STRING,
      scholarship: DataTypes.STRING,
      major: DataTypes.STRING,
      level: DataTypes.STRING,
      birthPlace: DataTypes.STRING,
      drugsConsumption: DataTypes.BOOLEAN,
      drugsTreatment: DataTypes.BOOLEAN,
      whichDrugs: DataTypes.STRING,
      dose: DataTypes.STRING,
      q1: DataTypes.BOOLEAN,
      q2: DataTypes.BOOLEAN,
      q3: DataTypes.BOOLEAN,
      q4: DataTypes.BOOLEAN,
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
