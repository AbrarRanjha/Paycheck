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
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    saleAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    date: {
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
    commissionRate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grossCommission: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IORef: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grossFCI: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    FCIRecognition: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    submittedPremium: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payable: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    incomeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cashType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = SalesData;
