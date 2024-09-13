/* eslint-disable no-undef */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../../db.js');

const SalesData = sequelize.define(
  'SalesData',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    transactionID: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    planType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    plzNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    frequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grossFCI: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    FCIRecognition: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    premium: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    payable: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    percetagePayable: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cashType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cashMatchId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SalesData;
